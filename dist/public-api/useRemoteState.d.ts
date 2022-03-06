import { EntityById } from './Entity';
import { RemoteStateOptions } from './RemoteStateOptions';
export declare function useRemoteState<P, T>(entity: EntityById<P, T>, options?: RemoteStateOptions<P, T>): readonly [T | undefined, (value: T) => void, {
    readonly loading: boolean;
}];
