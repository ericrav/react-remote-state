import { Entity, EntityById } from '../public-api/Entity';

export class EntityCache {
  private cache = new WeakMap<Entity<any, any>, Record<string, any>>();

  public get<T>(entity: EntityById<T>): { value: T } | undefined {
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
