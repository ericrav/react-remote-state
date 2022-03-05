import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { EntityById } from './Entity';
import { RemoteStateOptions } from './RemoteStateOptions';
import { useEntityCache } from './useEntityCache';

export function useRemoteState<T>(entity: EntityById<T>, options: RemoteStateOptions<T> = {}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const cache = useEntityCache();
  const getValue = () => {
    const cacheValue = cache.get(entity);
    return cacheValue ? cacheValue.value : options.defaultValue;
  };
  const [state, setState] = useState(getValue());
  const stateRef = useRef(state);
  const getValueRef = useRef(getValue);
  getValueRef.current = getValue;
  const [loading, setLoading] = useState(false);

  const localUpdate = useCallback((value: T) => {
    setState(value);
    cache.set(entity, value);
  }, [cache, entity.scope, entity.key]);

  useEffect(() => {
    const { query, defaultValue } = optionsRef.current;

    // when args change, re-assign default value
    if (stateRef.current !== defaultValue) {
      localUpdate(getValueRef.current()!);
    }

    if (query) {
      setLoading(true);
      (async () => {
        const result = await query(entity.key);
        localUpdate(result);
        setLoading(false);
      })();
    }
  }, [cache, entity.key, localUpdate]);

  return [state, localUpdate, { loading }] as const;
}
