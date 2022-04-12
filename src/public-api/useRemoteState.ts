import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { hashEntity } from '../utils/hashEntity';
import { useQuery } from '../utils/useQuery';
import { EntityById } from './Entity';
import { RemoteStateOptions } from './RemoteStateOptions';
import { useEntityCache } from './useEntityCache';
import { useRefAndUpdate } from '../utils/useRefAndUpdate';
import { useMutation } from '../utils/useMutation';

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

  const { defaultValue } = mergedOptions;

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
  const query = useQuery(entity, mergedOptions);
  const [updateState, mutation] = useMutation(entityMemo, mergedOptions);

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

  useEffect(() => {
    const { getValue, state } = ref.current;
    const value = getValue();

    // when args change, re-assign default value
    if (state !== value) {
      cache.update(entityMemo, value as T);
    }
  }, [cache, entityMemo, ref]);

  return [state, updateState, { query, mutation }] as const;
}
