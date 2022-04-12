import { useCallback, useEffect, useState } from 'react';
import { EntityById } from '../public-api/Entity';
import {
  MutateOptions,
  RemoteStateOptions,
} from '../public-api/RemoteStateOptions';
import { useEntityCache } from '../public-api/useEntityCache';
import { EntityCache } from './EntityCache';
import { useRefAndUpdate } from './useRefAndUpdate';

export function useMutation<P, T>(
  entity: EntityById<P, T>,
  options: RemoteStateOptions<P, T> = {},
) {
  const cache = useEntityCache();
  const [loading, setLoading] = useState(cache.mutations.has(entity));

  const { mutate, mutateOptions } = options;

  const ref = useRefAndUpdate({
    mutateOptions,
  });

  /** Subscribe to mutations cache to set loading state */
  useEffect(() => {
    setLoading(cache.mutations.has(entity));
    const unsubscribe = cache.mutations.subscribe(entity, () => {
      if (cache.mutations.get(entity)?.inProgress) {
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
        handleMutation(
          () => mutate(value, ...entity.params),
          entity,
          cache,
          ref.current.mutateOptions,
        );
      }
    },
    [cache, entity, mutate, ref],
  );

  return [updateState, { loading }] as const;
}

function handleMutation<P, T>(
  mutateFn: () => any,
  entity: EntityById<P, T>,
  cache: EntityCache,
  options: MutateOptions = {},
) {
  const { debounce } = options;

  const execute = () => {
    window.clearTimeout(cache.mutations.get(entity)?.debounceTimer);
    cache.mutations.set(entity, {
      inProgress: true,
    });
    Promise.resolve(mutateFn()).then((result) => {
      cache.set(entity, result);
      cache.mutations.delete(entity);
    });
  };

  const mutationCache = cache.mutations.get(entity);

  if (debounce) {
    window.clearTimeout(mutationCache?.debounceTimer);

    const debounceTimer = window.setTimeout(execute, debounce);
    cache.mutations.set(entity, {
      ...mutationCache,
      debounceTimer,
    });
  } else {
    execute();
  }
}
