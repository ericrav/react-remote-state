import { Entity, EntityById } from '../public-api/Entity';

interface CacheValue<T> {
  value: T;
  timestamp: number;
}

type CacheMap<T = any> = Record<string, CacheValue<T>>;

const hashEntity = (entity: EntityById<any, any>) => entity.params.join('$');

export class EntityCache {
  private cache = new WeakMap<Entity<any, any>, CacheMap>();

  public get<T>(entity: EntityById<any, T>): CacheValue<T> | undefined {
    return this.cache.get(entity.scope)?.[hashEntity(entity)];
  }

  public set<T>(entity: EntityById<any, T>, value: T) {
    if (!this.cache.has(entity.scope)) {
      this.cache.set(entity.scope, {});
    }
    const map = this.cache.get(entity.scope)!;
    map[hashEntity(entity)] = {
      value,
      timestamp: Date.now(),
    };
  }
}
