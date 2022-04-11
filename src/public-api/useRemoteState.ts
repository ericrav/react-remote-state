import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { hashEntity } from '../utils/hashEntity';
import { useQuery } from '../utils/useQuery';
import { EntityById } from './Entity';
import { RemoteStateOptions } from './RemoteStateOptions';
import { useEntityCache } from './useEntityCache';
import { useRefAndUpdate } from '../utils/useRefAndUpdate';

export function useRemoteState<P, T>(
  entity: EntityById<P, T>,
  options: RemoteStateOptions<P, T> = {},
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const entityMemo = useMemo(() => entity, [entity.scope, hashEntity(entity)]);

  const mergedOptions = {
    ...entity.options,
    ...options,
  };

  const { mutate, defaultValue } = mergedOptions;

  const cache = useEntityCache();
  const getValue = (): T | undefined => {
    const cacheValue = cache.get(entity);
    return cacheValue ? cacheValue.value : defaultValue;
  };
  const [state, setState] = useState(getValue());
  const ref = useRefAndUpdate({
    state,
    getValue,
    options: mergedOptions,
  });
  const { loading } = useQuery(entity, mergedOptions);

  /** Subscribe to entity changes in cache */
  useEffect(() => {
    const unsubscribe = cache.subscribe(entityMemo, () => {
      const cacheValue = cache.get(entityMemo)!;
      if (cacheValue && cacheValue.value !== ref.current.state) {
        setState(cacheValue.value);
      }
    });

    return unsubscribe;
  }, [cache, entityMemo, ref]);

  const updateState = useCallback(
    (setter: T | ((prev: T) => T)) => {
      const value = typeof setter === 'function'
        ? (setter as (prev: T) => T)(ref.current.getValue() as T)
        : setter;

      cache.set(entityMemo, value);
      if (mutate) {
        Promise.resolve(mutate(value, ...entityMemo.params)).then((result) => {
          cache.set(entityMemo, result);
        });
      }
    },
    [cache, entityMemo, mutate, ref],
  );

  useEffect(() => {
    const { getValue, state } = ref.current;
    const value = getValue();

    // when args change, re-assign default value
    if (state !== value) {
      // setState(value);
      cache.set(entityMemo, value as T);
    }
  }, [cache, entityMemo, ref]);

  return [state, updateState, { loading }] as const;
}
