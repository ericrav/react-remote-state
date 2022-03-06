import { EntityById } from '../public-api/Entity';
import { RemoteStateOptions } from '../public-api/RemoteStateOptions';
export declare function useQuery<P, T>(entity: EntityById<P, T>, options?: RemoteStateOptions<P, T>): {
    loading: boolean;
    data: T | undefined;
};
