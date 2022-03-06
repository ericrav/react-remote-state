import { hashEntity } from './hashEntity';
export class EntityCache {
    constructor() {
        this.cache = new WeakMap();
        this.subscribers = new WeakMap();
    }
    subscribe(entity, callback) {
        if (!this.subscribers.has(entity.scope)) {
            this.subscribers.set(entity.scope, new Set());
        }
        const set = this.subscribers.get(entity.scope);
        set.add(callback);
        return function unsubscribe() {
            set.delete(callback);
        };
    }
    notifySubscribers(entity) {
        const set = this.subscribers.get(entity.scope);
        if (set) {
            set.forEach((cb) => cb());
        }
    }
    get(entity) {
        var _a;
        return (_a = this.cache.get(entity.scope)) === null || _a === void 0 ? void 0 : _a[hashEntity(entity)];
    }
    set(entity, value) {
        if (!this.cache.has(entity.scope)) {
            this.cache.set(entity.scope, {});
        }
        const map = this.cache.get(entity.scope);
        map[hashEntity(entity)] = {
            value,
            timestamp: Date.now(),
        };
        this.notifySubscribers(entity);
    }
}
