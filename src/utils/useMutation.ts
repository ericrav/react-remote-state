import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { EntityById } from '../public-api/Entity';
import { RemoteStateOptions } from '../public-api/RemoteStateOptions';
import { useEntityCache } from '../public-api/useEntityCache';

export function useMutation<P, T>(
  entity: EntityById<P, T>,
  options: RemoteStateOptions<P, T> = {},
) {
  const cache = useEntityCache();
  const [loading, setLoading] = useState(cache.mutations.has(entity));

  const { mutate } = options;

  /** Subscribe to mutations cache to set loading state */
  useEffect(() => {
    setLoading(cache.mutations.has(entity));
    const unsubscribe = cache.mutations.subscribe(entity, () => {
      if (cache.mutations.has(entity)) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [cache.mutations, entity]);

  const updateState = useCallback(
    (setter: T | ((prev: T) => T)) => {
      const value = typeof setter === 'function'
        ? (setter as (prev: T) => T)(cache.get(entity)?.value as T)
        : setter;

      cache.update(entity, value);

      if (mutate) {
        Promise.resolve(mutate(value, ...entity.params)).then((result) => {
          cache.set(entity, result);
        });
      }
    },
    [cache, entity, mutate],
  );

  return [updateState, { loading }] as const;
}
