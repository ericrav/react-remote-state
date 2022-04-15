import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { EntityById } from '../public-api/Entity';
import { RemoteStateOptions } from '../public-api/RemoteStateOptions';
import { useEntityCache } from '../public-api/useEntityCache';
import { deriveEntities } from './deriveEntities';
import { hashEntity } from './hashEntity';
import { shouldRevalidate } from './shouldRevalidate';
import { useRefAndUpdate } from './useRefAndUpdate';

export function useQuery<P, T>(
  entity: EntityById<P, T>,
  options: RemoteStateOptions<P, T> = {},
) {
  const cache = useEntityCache();
  const [loading, setLoading] = useState(cache.queries.has(entity));

  const data = useRef<T>();

  const optionsRef = useRefAndUpdate(options);

  const queryRef = useRefAndUpdate(options.query ?? entity.options?.query);

  const entityRef = useRefAndUpdate(entity);

  const entityHashKey = hashEntity(entity);

  const entityHash = hashEntity(entity);
  const entityChanges = useMemo(() => [entity.scope, entityHash], [entity.scope, entityHash]);

  /** Subscribe to queries cache to set loading state */
  useEffect(() => {
    setLoading(cache.queries.has(entityRef.current));
    const unsubscribe = cache.queries.subscribe(entityRef.current, () => {
      if (cache.queries.has(entityRef.current)) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [cache.queries, entityChanges, entityRef]);

  /** Execute entity query & save to cache */
  useEffect(() => {
    const query = queryRef.current;
    if (query && shouldRevalidate(cache, entityRef.current, optionsRef.current)) {
      setLoading(true);
      cache.queries.set(entityRef.current, query);
      (async () => {
        const result = (await query(...entityRef.current.params)) as T;
        cache.set(entityRef.current, result);
        data.current = result;
        cache.queries.delete(entityRef.current);

        const { onQuerySuccess } = optionsRef.current;
        if (onQuerySuccess) {
          const derived = onQuerySuccess(result);
          deriveEntities(derived, cache);
        }

        setLoading(false);
      })();
    }
  }, [cache, entityHashKey, entity.scope, queryRef, entityRef, optionsRef]);

  return { loading, data: data.current };
}
