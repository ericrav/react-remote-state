interface RemoteStateOptions<T> {
  query?: (args: string) => T | Promise<T> | Promise<{ key: string; value: T }>;
  defaultValue?: T;
  meta?: string;
}
export interface Entity<P, T> {
  (): EntityById<T>;
  (...params: P extends any[] ? P : [P]): EntityById<T>;
  scope: string;
}

export interface EntityById<T> {
  (value: T): ({ key: string; value: T });
  key: string;
  options?: RemoteStateOptions<T>
}

let globalKeyId = 0;

export function __test_reset_entity_key() { globalKeyId = 0; } // eslint-disable-line

// options: {
//   query: (...args: P) => T;
//   mutate?: (state: T, ...args: P) => void;
// }

export function entity<P, T>(options?: RemoteStateOptions<T>): Entity<P, T> {
  const scope = `entity-${globalKeyId += 1}`;
  const entityFactory: Entity<P, T> = (...params) => {
    const key = `${scope}-${params.join('$')}`;
    const entityById: EntityById<T> = (value) => ({ key, value });
    entityById.key = key;
    entityById.options = options;
    return entityById;
  };
  entityFactory.scope = scope;
  return entityFactory;
}

// const note = entity({
//   query: (id) => ({ id }),
//   mutate: (state, id) => updateNote(state, id),
// });

// const note: Entity<string, string> = entity<string, string>({
//   query: (id) => Promise.resolve(note(id)('note value')),
// });
// note('5');
// useRemoteState(user('254234'))
