import { useEffect, useRef, useState } from 'react';
import { RemoteStateOptions } from './RemoteStateOptions';

export function useRemoteState<T>(args: string, options: RemoteStateOptions<T>) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const stateRef = useRef(options.defaultValue);
  const [state, setState] = useState(options.defaultValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { query, defaultValue } = optionsRef.current;

    // when args change, re-assign default value
    if (stateRef.current !== defaultValue) {
      setState(defaultValue);
    }

    if (query) {
      setLoading(true);
      (async () => {
        const result = await query(args);
        setState(result);
        setLoading(false);
      })();
    }
  }, [args]);

  return [state, setState, { loading }] as const;
}
