import { EntityById } from '../public-api/Entity';
import { BaseCache } from './BaseCache';

interface CacheValue<T> {
  value: T;
  timestamp: number;
}

export class EntityCache extends BaseCache<CacheValue<any>> {
  public get<T>(entity: EntityById<any, T>): CacheValue<T> | undefined {
    return super.get(entity);
  }

  public set<T>(entity: EntityById<any, T>, value: T) {
    const cacheValue: CacheValue<T> = {
      value,
      timestamp: Date.now(),
    };
    super.set(entity, cacheValue);
  }
}
