export interface RemoteStateOptions<T> {
  query?: (args: string) => T | Promise<T>;
  defaultValue?: T;
  meta?: string;
}
