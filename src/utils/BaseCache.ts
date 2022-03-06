import { Entity, EntityById } from '../public-api/Entity';
import { hashEntity } from './hashEntity';

type EntityMap<T> = WeakMap<Entity<any, any>, T>;
type CacheMap<T = any> = Record<string, T>;

export class BaseCache<V> {
  private cache: EntityMap<CacheMap<V>> = new WeakMap();

  private subscribers: EntityMap<Set<() => void>> = new WeakMap();

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

  public get<T>(entity: EntityById<any, T>): V | undefined {
    return this.cache.get(entity.scope)?.[hashEntity(entity)];
  }

  public set(entity: EntityById, value: V) {
    if (!this.cache.has(entity.scope)) {
      this.cache.set(entity.scope, {});
    }
    const map = this.cache.get(entity.scope)!;
    map[hashEntity(entity)] = value;
    this.notifySubscribers(entity);
  }
}
