import { EntityCache } from '../utils/EntityCache';
let globalEntityCache;
export function useEntityCache() {
    if (!globalEntityCache)
        globalEntityCache = new EntityCache();
    return globalEntityCache;
}
