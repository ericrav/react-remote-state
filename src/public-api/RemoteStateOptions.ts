import type { EntityValue, Params } from './Entity';

export interface MutateOptions {
  throttle?: false | number;
  debounce?: false | number;
}

export interface RemoteStateOptions<P, T> {
  query?: (...params: Params<P>) => T | Promise<T> | Promise<EntityValue<T>>;
  mutate?: (newValue: T, ...params: Params<P>) => any;
  mutateOptions?: MutateOptions;
  defaultValue?: T;
  queryTTL?: number;
}
