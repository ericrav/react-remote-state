// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook, RenderResult } from '@testing-library/react-hooks';

export function testHook<P extends any[], T>(hook: (...args: P) => T) {
  let firstCall = true;
  let rerenderHook: (props: P) => void;
  let hookResult: RenderResult<T>;

  const useHook = (...args: P) => {
    if (firstCall) {
      const { result, rerender } = renderHook(
        (args_) => hook(...args_),
        { initialProps: args },
      );
      hookResult = result;
      rerenderHook = rerender;
      firstCall = false;
    } else {
      rerenderHook(args);
    }

    return hookResult.current;
  };

  return [useHook];
}
