import type { RemoteStateOptions } from './RemoteStateOptions';

export interface EntityValue<P = any, T = any> {
  key: string;
  value: T;
  options: EntityOptions<P, T>;
}

interface EntityOptions<P, T> extends RemoteStateOptions<P, T> {
  derive?: (value: T) => EntityValue[];
}

// export interface Entity<P, T> {
//   (): EntityById<P, T>;
//   (...params: P extends any[] ? P : [P]): EntityById<P, T>;
// }

export type Params<P> = P extends any[] ? P : [P] | [];
export type Entity<P, T> = (...params: Params<P>) => EntityById<P, T>;

export interface EntityById<P, T> {
  (value: T): EntityValue<P, T>;
  scope: Entity<any, T>;
  params: Params<P>;
  options: EntityOptions<P, T>
}

export function entity<P, T>(
  options: EntityOptions<P, T> = {},
): Entity<P, T> {
  const entityFactory: Entity<P, T> = (...params) => {
    const key = params.join('$');
    const entityById: EntityById<P, T> = (value) => ({ key, value, options });
    entityById.scope = entityFactory;
    entityById.params = params;
    entityById.options = options;
    return entityById;
  };
  return entityFactory;
}
