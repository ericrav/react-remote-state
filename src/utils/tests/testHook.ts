// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook, RenderResult, WaitForNextUpdate } from '@testing-library/react-hooks';

export function testHook<P extends any[], T>(hook: (...args: P) => T) {
  let firstCall = true;
  let rerenderHook: (props: P) => void;
  let hookResult: RenderResult<T>;
  const extra = {} as {
    waitForNextUpdate: WaitForNextUpdate
  };

  const useHook = (...args: P) => {
    if (firstCall) {
      const { result, rerender, waitForNextUpdate } = renderHook(
        (args_) => hook(...args_),
        { initialProps: args },
      );
      hookResult = result;
      rerenderHook = rerender;
      firstCall = false;
      extra.waitForNextUpdate = waitForNextUpdate;
    } else {
      rerenderHook(args);
    }

    return hookResult.current;
  };

  return [useHook, extra] as const;
}
