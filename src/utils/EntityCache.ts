import { EntityById } from '../public-api/Entity';
import { BaseCache } from './BaseCache';

interface CacheValue<T> {
  value: T;
  validatedValue?: T;
  timestamp: number;
}

export class EntityCache extends BaseCache<CacheValue<any>> {
  public queries = new BaseCache<() => any>();

  public mutations = new BaseCache<() => any>();

  public get<T>(entity: EntityById<any, T>): CacheValue<T> | undefined {
    return super.get(entity);
  }

  public set<T>(entity: EntityById<any, T>, value: T) {
    const cacheValue: CacheValue<T> = {
      value,
      validatedValue: value,
      timestamp: Date.now(),
    };
    super.set(entity, cacheValue);
  }

  public update<T>(entity: EntityById<any, T>, value: T) {
    const cacheValue = this.get(entity) || { timestamp: 0 };
    super.set(entity, { ...cacheValue, value });
  }
}
