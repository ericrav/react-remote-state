import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { hashEntity } from '../utils/hashEntity';
import { useQuery } from '../utils/useQuery';
import { EntityById } from './Entity';
import { RemoteStateOptions } from './RemoteStateOptions';
import { useEntityCache } from './useEntityCache';

export function useRemoteState<P, T>(
  entity: EntityById<P, T>,
  options: RemoteStateOptions<P, T> = {},
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const cache = useEntityCache();
  const getValue = (): T | undefined => {
    const cacheValue = cache.get(entity);
    return cacheValue ? cacheValue.value : options.defaultValue;
  };
  const [state, setState] = useState(getValue());
  const stateRef = useRef(state);
  stateRef.current = state;
  const getValueRef = useRef(getValue);
  getValueRef.current = getValue;
  const { loading } = useQuery(entity, options);

  const entityHash = hashEntity(entity);
  const entityChanges = useMemo(() => [entity.scope, entityHash], [entity.scope, entityHash]);

  useEffect(() => {
    const unsubscribe = cache.subscribe(entity, () => {
      const cacheValue = cache.get(entity)!;
      if (cacheValue && cacheValue.value !== stateRef.current) {
        setState(cacheValue.value);
      }
    });

    return unsubscribe;
  }, [cache, entity]);

  const localUpdate = useCallback(
    (value: T) => {
      setState(value);
      optionsRef.current.mutate?.(value, ...entity.params);
      cache.set(entity, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cache, entityChanges],
  );

  useEffect(() => {
    const value = getValueRef.current();

    // when args change, re-assign default value
    if (stateRef.current !== value) {
      setState(value);
      cache.set(entity, value as T);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, entityChanges]);

  return [state, localUpdate, { loading }] as const;
}
