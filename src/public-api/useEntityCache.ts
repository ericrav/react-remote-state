import { EntityCache } from '../utils/EntityCache';

let globalEntityCache: EntityCache;

export function useEntityCache() {
  if (!globalEntityCache) globalEntityCache = new EntityCache();

  return globalEntityCache;
}

// export for tests only
export function resetEntityCache() {
  globalEntityCache = new EntityCache();
}
