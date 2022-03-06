import { useCallback, useEffect, useRef, useState, } from 'react';
import { useQuery } from '../utils/useQuery';
import { useEntityCache } from './useEntityCache';
export function useRemoteState(entity, options = {}) {
    const optionsRef = useRef(options);
    optionsRef.current = options;
    const cache = useEntityCache();
    const getValue = () => {
        const cacheValue = cache.get(entity);
        return cacheValue ? cacheValue.value : options.defaultValue;
    };
    const [state, setState] = useState(getValue());
    const stateRef = useRef(state);
    const getValueRef = useRef(getValue);
    getValueRef.current = getValue;
    const { loading } = useQuery(entity, options);
    useEffect(() => {
        const unsubscribe = cache.subscribe(entity, () => {
            const cacheValue = cache.get(entity);
            if (cacheValue && cacheValue.value !== stateRef.current) {
                setState(cacheValue.value);
            }
        });
        return unsubscribe;
    }, [cache, entity]);
    const localUpdate = useCallback((value) => {
        setState(value);
        cache.set(entity, value);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cache, entity.scope, entity.params[0], entity.params[1]]);
    useEffect(() => {
        const { defaultValue } = optionsRef.current;
        // when args change, re-assign default value
        if (stateRef.current !== defaultValue) {
            localUpdate(getValueRef.current());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cache, localUpdate]);
    return [state, localUpdate, { loading }];
}
