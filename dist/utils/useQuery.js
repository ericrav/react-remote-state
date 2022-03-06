var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useRef, useState } from 'react';
import { useEntityCache } from '../public-api/useEntityCache';
import { hashEntity } from './hashEntity';
export function useQuery(entity, options = {}) {
    var _a, _b, _c, _d;
    const [loading, setLoading] = useState(false);
    const cache = useEntityCache();
    const data = useRef();
    const queryRef = useRef((_a = options.query) !== null && _a !== void 0 ? _a : (_b = entity.options) === null || _b === void 0 ? void 0 : _b.query);
    queryRef.current = (_c = options.query) !== null && _c !== void 0 ? _c : (_d = entity.options) === null || _d === void 0 ? void 0 : _d.query;
    const entityRef = useRef(entity);
    entityRef.current = entity;
    const entityHashKey = hashEntity(entity);
    useEffect(() => {
        const query = queryRef.current;
        if (query) {
            setLoading(true);
            (() => __awaiter(this, void 0, void 0, function* () {
                const result = (yield query(...entityRef.current.params));
                cache.set(entityRef.current, result);
                data.current = result;
                setLoading(false);
            }))();
        }
    }, [cache, entityHashKey, entity.scope]);
    return { loading, data: data.current };
}
