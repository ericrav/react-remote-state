import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { hashEntity } from '../utils/hashEntity';
import { useQuery } from '../utils/useQuery';
import { EntityById } from './Entity';
import { RemoteStateOptions } from './RemoteStateOptions';
import { useEntityCache } from './useEntityCache';

const useRefAndUpdate = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export function useRemoteState<P, T>(
  entity: EntityById<P, T>,
  options: RemoteStateOptions<P, T> = {},
) {
  const cache = useEntityCache();
  const getValue = (): T | undefined => {
    const cacheValue = cache.get(entity);
    return cacheValue ? cacheValue.value : options.defaultValue;
  };
  const [state, setState] = useState(getValue());
  const ref = useRefAndUpdate({
    state,
    getValue,
  });
  const { loading } = useQuery(entity, options);

  const entityHash = hashEntity(entity);
  const entityChanges = useMemo(() => [entity.scope, entityHash], [entity.scope, entityHash]);

  useEffect(() => {
    const unsubscribe = cache.subscribe(entity, () => {
      const cacheValue = cache.get(entity)!;
      if (cacheValue && cacheValue.value !== ref.current.state) {
        setState(cacheValue.value);
      }
    });

    return unsubscribe;
  }, [cache, entity, ref]);

  const localUpdate = useCallback(
    (value: T) => {
      setState(value);
      options.mutate?.(value, ...entity.params);
      cache.set(entity, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cache, entityChanges, options.mutate],
  );

  useEffect(() => {
    const { getValue, state } = ref.current;
    const value = getValue();

    // when args change, re-assign default value
    if (state !== value) {
      setState(value);
      cache.set(entity, value as T);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, entityChanges]);

  return [state, localUpdate, { loading }] as const;
}
