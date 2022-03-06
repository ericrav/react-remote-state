import { Entity, EntityById } from '../public-api/Entity';
import { hashEntity } from './hashEntity';

interface CacheValue<T> {
  value: T;
  timestamp: number;
}

type CacheMap<T = any> = Record<string, CacheValue<T>>;

export class EntityCache {
  private cache = new WeakMap<Entity<any, any>, CacheMap>();

  private subscribers = new WeakMap<Entity<any, any>, Set<() => void>>();

  public subscribe(entity: EntityById<any, any>, callback: () => void) {
    if (!this.subscribers.has(entity.scope)) {
      this.subscribers.set(entity.scope, new Set());
    }
    const set = this.subscribers.get(entity.scope)!;
    set.add(callback);
    return function unsubscribe() {
      set.delete(callback);
    };
  }

  private notifySubscribers(entity: EntityById<any, any>) {
    const set = this.subscribers.get(entity.scope);
    if (set) {
      set.forEach((cb) => cb());
    }
  }

  public has(entity: EntityById<any, any>): boolean {
    const map = this.cache.get(entity.scope);
    return !!map && !!map[hashEntity(entity)];
  }

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
    this.notifySubscribers(entity);
  }
}
