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
  scope: string;
}

export interface EntityById<T> {
  (value: T): EntityValue<T>;
  key: string;
  options?: EntityOptions<T>
}

let globalKeyId = 0;

export function __test_reset_entity_key() { globalKeyId = 0; } // eslint-disable-line

export function entity<P, T>(options: EntityOptions<T> = {}): Entity<P, T> {
  const scope = `entity-${globalKeyId += 1}`;
  const entityFactory: Entity<P, T> = (...params) => {
    const key = `${scope}-${params.join('$')}`;
    const entityById: EntityById<T> = (value) => ({ key, value, options });
    entityById.key = key;
    entityById.options = options;
    return entityById;
  };
  entityFactory.scope = scope;
  return entityFactory;
}
