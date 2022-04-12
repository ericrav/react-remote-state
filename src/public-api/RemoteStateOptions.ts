import type { EntityValue, Params } from './Entity';

export interface RemoteStateOptions<P, T> {
  query?: (...params: Params<P>) => T | Promise<T> | Promise<EntityValue<T>>;
  mutate?: (newValue: T, ...params: Params<P>) => any;
  mutateOptions?: {
    throttle?: false | number;
    debounce?: false | number;
  };
  defaultValue?: T;
  queryTTL?: number;
}
