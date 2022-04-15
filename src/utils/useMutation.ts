import { useCallback, useEffect, useState } from 'react';
import { EntityById } from '../public-api/Entity';
import { RemoteStateOptions } from '../public-api/RemoteStateOptions';
import { useEntityCache } from '../public-api/useEntityCache';
import { EntityCache } from './EntityCache';
import { useRefAndUpdate } from './useRefAndUpdate';

export function useMutation<P, T>(
  entity: EntityById<P, T>,
  options: RemoteStateOptions<P, T> = {},
) {
  const cache = useEntityCache();
  const [loading, setLoading] = useState(cache.mutations.has(entity));

  const { mutate } = options;

  const ref = useRefAndUpdate({
    options,
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

      const lastValidatedValue = cache.get(entity)?.validatedValue;

      if (mutate) {
        handleMutation(
          () => mutate(value, entity.params, lastValidatedValue),
          entity,
          cache,
          ref.current.options,
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
  options: RemoteStateOptions<P, T>,
) {
  const { onMutateSuccess } = options;
  const { debounce } = options.mutateOptions || {};

  const execute = () => {
    window.clearTimeout(cache.mutations.get(entity)?.debounceTimer);
    cache.mutations.set(entity, {
      inProgress: true,
    });
    Promise.resolve(mutateFn()).then((result) => {
      cache.set(entity, result);
      cache.mutations.delete(entity);
      if (onMutateSuccess) {
        const derived = onMutateSuccess(result);
        if (Array.isArray(derived)) {
          derived.forEach((item) => {
            const value = typeof item.value === 'function' ? item.value(cache.get(item.entity)?.value ?? item.entity.options.defaultValue) : item.value;
            cache.set(item.entity, value);
          });
        } else {
          const value = typeof derived.value === 'function' ? derived.value(cache.get(derived.entity)?.value ?? derived.entity.options.defaultValue) : derived.value;
          cache.set(derived.entity, value);
        }
      }
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
