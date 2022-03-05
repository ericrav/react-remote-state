import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { RemoteStateOptions } from './RemoteStateOptions';
import { useEntityCache } from './useEntityCache';

export function useRemoteState<T>(key: string, options: RemoteStateOptions<T>) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const cache = useEntityCache();
  const getValue = () => {
    const cacheValue = cache.get(key);
    return cacheValue ? cacheValue.value : options.defaultValue;
  };
  const [state, setState] = useState(getValue());
  const stateRef = useRef(state);
  const getValueRef = useRef(getValue);
  getValueRef.current = getValue;
  const [loading, setLoading] = useState(false);

  const localUpdate = useCallback((value: T) => {
    setState(value);
    cache.set(key, value);
  }, [cache, key]);

  useEffect(() => {
    const { query, defaultValue } = optionsRef.current;

    // when args change, re-assign default value
    if (stateRef.current !== defaultValue) {
      localUpdate(getValueRef.current());
    }

    if (query) {
      setLoading(true);
      (async () => {
        const result = await query(key);
        localUpdate(result);
        setLoading(false);
      })();
    }
  }, [cache, key, localUpdate]);

  return [state, localUpdate, { loading }] as const;
}
