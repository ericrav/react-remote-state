import {
  useCallback, useEffect, useRef, useState,
} from 'react';
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
  const getValueRef = useRef(getValue);
  getValueRef.current = getValue;
  const { loading } = useQuery(entity, options);

  useEffect(() => {
    const unsubscribe = cache.subscribe(entity, () => {
      const { value } = cache.get(entity)!;
      if (value !== stateRef.current) {
        setState(value);
      }
    });

    return unsubscribe;
  }, [cache, entity]);

  const localUpdate = useCallback(
    (value: T) => {
      setState(value);
      cache.set(entity, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cache, entity.scope, entity.params[0], entity.params[1]],
  );

  useEffect(() => {
    const { defaultValue } = optionsRef.current;

    // when args change, re-assign default value
    if (stateRef.current !== defaultValue) {
      localUpdate(getValueRef.current()!);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, entity.params[0], entity.params[1], localUpdate]);

  return [state, localUpdate, { loading }] as const;
}
