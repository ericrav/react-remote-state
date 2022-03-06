import type { RemoteStateOptions } from './RemoteStateOptions';
export interface EntityValue<P = any, T = any> {
    key: string;
    value: T;
    options: EntityOptions<P, T>;
}
interface EntityOptions<P, T> extends RemoteStateOptions<P, T> {
    derive?: (value: T) => EntityValue[];
}
export declare type Params<P> = P extends any[] ? P : [P] | [];
export declare type Entity<P, T> = (...params: Params<P>) => EntityById<P, T>;
export interface EntityById<P, T> {
    (value: T): EntityValue<P, T>;
    scope: Entity<any, T>;
    params: Params<P>;
    options: EntityOptions<P, T>;
}
export declare function entity<P, T>(options?: EntityOptions<P, T>): Entity<P, T>;
export {};
