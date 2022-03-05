interface EntityValue<T> {
  key: string;
  value: T;
  options: EntityOptions<T>;
}

interface EntityOptions<T> {
  query?: (args: string) => T | Promise<T> | Promise<EntityValue<T>>;
  defaultValue?: T;
  meta?: string;
  derive?: (value: T) => EntityValue<any>[];
}
export interface Entity<P, T> {
  (): EntityById<T>;
  (...params: P extends any[] ? P : [P]): EntityById<T>;
}

export interface EntityById<T> {
  (value: T): EntityValue<T>;
  scope: Entity<any, T>;
  key: string;
  options?: EntityOptions<T>
}

let globalKeyId = 0;

export function __test_reset_entity_key() { globalKeyId = 0; } // eslint-disable-line

export function entity<P, T>(options: EntityOptions<T> = {}): Entity<P, T> {
  const entityFactory: Entity<P, T> = (...params) => {
    const key = params.join('$');
    const entityById: EntityById<T> = (value) => ({ key, value, options });
    entityById.scope = entityFactory;
    entityById.key = key;
    entityById.options = options;
    return entityById;
  };
  return entityFactory;
}
