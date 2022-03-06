import { Entity, EntityById } from '../public-api/Entity';

interface CacheValue<T> {
  value: T;
  timestamp: number;
}

type CacheMap<T = any> = Record<string, CacheValue<T>>;

export class EntityCache {
  private cache = new WeakMap<Entity<any, any>, CacheMap>();

  public get<T>(entity: EntityById<T>): CacheValue<T> | undefined {
    return this.cache.get(entity.scope)?.[entity.key];
  }

  public set<T>(entity: EntityById<T>, value: T) {
    if (!this.cache.has(entity.scope)) {
      this.cache.set(entity.scope, {});
    }
    const map = this.cache.get(entity.scope)!;
    map[entity.key] = {
      value,
      timestamp: Date.now(),
    };
  }
}
