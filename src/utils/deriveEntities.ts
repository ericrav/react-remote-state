import { EntityById, EntityValue } from '../public-api/Entity';
import { EntityCache } from './EntityCache';

export function deriveEntities(
  derived: EntityValue<any, any> | EntityValue<any, any>[],
  cache: EntityCache,
) {
  if (Array.isArray(derived)) {
    derived.forEach((item) => updateCache(item, cache));
  } else {
    updateCache(derived, cache);
  }
}

function updateCache(item: EntityValue<any, any>, cache: EntityCache) {
  const value = typeof item.value === 'function'
    ? item.value(getEntityValue(item.entity, cache))
    : item.value;
  cache.set(item.entity, value);
}

function getEntityValue<P, T>(entity: EntityById<P, T>, cache: EntityCache): T | undefined {
  const cacheValue = cache.get(entity);
  return cacheValue ? cacheValue.value : entity.options.defaultValue;
}
