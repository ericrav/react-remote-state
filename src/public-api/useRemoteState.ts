import {
  useCallback, useEffect, useRef, useState,
} from 'react';
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
  const [loading, setLoading] = useState(false);

  const localUpdate = useCallback(
    (value: T) => {
      setState(value);
      cache.set(entity, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cache, entity.scope, entity.params[0], entity.params[1]],
  );

  useEffect(() => {
    const { query, defaultValue } = optionsRef.current;

    // when args change, re-assign default value
    if (stateRef.current !== defaultValue) {
      localUpdate(getValueRef.current()!);
    }

    if (query) {
      setLoading(true);
      (async () => {
        const result = (await query(...entity.params)) as T;
        localUpdate(result);
        setLoading(false);
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, entity.params[0], entity.params[1], localUpdate]);

  return [state, localUpdate, { loading }] as const;
}
