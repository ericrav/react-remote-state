import { EntityById } from '../public-api/Entity';
import { EntityCache } from './EntityCache';

export function shouldRevalidate<P, T>(
  cache: EntityCache,
  entity: EntityById<P, T>,
): boolean {
  if (cache.queries.has(entity)) {
    return false;
  }

  const cacheValue = cache.get(entity);
  if (!cacheValue) {
    return true;
  }
  const age = Date.now() - cacheValue.timestamp;

  if (age > 1000) return true;

  return false;
}
