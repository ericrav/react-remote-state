import type { RemoteStateOptions } from './RemoteStateOptions';

export interface EntityValue<P = any, T = any> {
  entity: EntityById<P, T>;
  value: T | ((prev: T) => T);
}

export type Params<P> = P extends any[] ? P : [P] | [];
export type Entity<P, T> = (...params: Params<P>) => EntityById<P, T>;

export interface EntityById<P = any, T = any> {
  (value: T | ((prev: T) => T)): EntityValue<P, T>;
  scope: Entity<any, T>;
  params: Params<P>;
  options: RemoteStateOptions<P, T>
}

export function entity<P, T>(
  options: RemoteStateOptions<P, T> = {},
): Entity<P, T> {
  const entityFactory: Entity<P, T> = (...params) => {
    const entityById: EntityById<P, T> = (value) => ({ entity: entityById, value });
    entityById.scope = entityFactory;
    entityById.params = params;
    entityById.options = options;
    return entityById;
  };
  return entityFactory;
}
