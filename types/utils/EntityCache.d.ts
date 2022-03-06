import { EntityById } from '../public-api/Entity';
interface CacheValue<T> {
    value: T;
    timestamp: number;
}
export declare class EntityCache {
    private cache;
    private subscribers;
    subscribe(entity: EntityById<any, any>, callback: () => void): () => void;
    private notifySubscribers;
    get<T>(entity: EntityById<any, T>): CacheValue<T> | undefined;
    set<T>(entity: EntityById<any, T>, value: T): void;
}
export {};
