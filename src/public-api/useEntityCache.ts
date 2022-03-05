import { EntityCache } from '../utils/EntityCache';

let globalEntityCache: EntityCache;

export function useEntityCache() {
  if (!globalEntityCache) globalEntityCache = new EntityCache();

  return globalEntityCache;
}
