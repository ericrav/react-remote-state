// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks';
export function testHook(hook) {
    let firstCall = true;
    let rerenderHook;
    let hookResult;
    const extra = {};
    const useHook = (...args) => {
        if (firstCall) {
            const { result, rerender, waitForNextUpdate } = renderHook((args_) => hook(...args_), { initialProps: args });
            hookResult = result;
            rerenderHook = rerender;
            firstCall = false;
            extra.waitForNextUpdate = waitForNextUpdate;
        }
        else {
            rerenderHook(args);
        }
        return hookResult.current;
    };
    return [useHook, extra];
}
