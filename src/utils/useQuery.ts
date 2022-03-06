import { useEffect, useRef, useState } from 'react';
import { EntityById } from '../public-api/Entity';
import { RemoteStateOptions } from '../public-api/RemoteStateOptions';
import { useEntityCache } from '../public-api/useEntityCache';
import { hashEntity } from './hashEntity';
import { shouldRevalidate } from './shouldRevalidate';
import { useRefAndUpdate } from './useRefAndUpdate';

export function useQuery<P, T>(
  entity: EntityById<P, T>,
  options: RemoteStateOptions<P, T> = {},
) {
  const [loading, setLoading] = useState(false);
  const cache = useEntityCache();

  const data = useRef<T>();

  const optionsRef = useRefAndUpdate(options);

  const queryRef = useRefAndUpdate(options.query ?? entity.options?.query);

  const entityRef = useRefAndUpdate(entity);

  const entityHashKey = hashEntity(entity);

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
        setLoading(false);
      })();
    }
  }, [cache, entityHashKey, entity.scope, queryRef, entityRef, optionsRef]);

  return { loading, data: data.current };
}
