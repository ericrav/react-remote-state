import { EntityById } from '../public-api/Entity';
import { RemoteStateOptions } from '../public-api/RemoteStateOptions';
import { EntityCache } from './EntityCache';

export function shouldRevalidate<P, T>(
  cache: EntityCache,
  entity: EntityById<P, T>,
  {
    queryTTL = 60000,
  }: RemoteStateOptions<P, T>,
): boolean {
  if (cache.queries.has(entity)) {
    return false;
  }

  const cacheValue = cache.get(entity);
  if (!cacheValue) {
    return true;
  }
  const age = Date.now() - cacheValue.timestamp;

  if (age > queryTTL) return true;

  return false;
}
