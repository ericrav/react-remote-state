import type { EntityValue, Params } from './Entity';

export interface MutateOptions {
  throttle?: false | number;
  debounce?: false | number;
}

type MutateFn<T, P> = (newValue: T, variables: Params<P>, lastValidatedValue: T | undefined) => any;

export interface RemoteStateOptions<P, T> {
  query?: (...params: Params<P>) => T | Promise<T> | Promise<EntityValue<T>>;
  mutate?: MutateFn<T, P>;
  mutateOptions?: MutateOptions;
  defaultValue?: T;
  queryTTL?: number;
  onQuerySuccess?: (value: T) => EntityValue | EntityValue[];
  onMutateSuccess?: (value: T) => EntityValue | EntityValue[];
}
