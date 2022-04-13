import { act, renderHook } from '@testing-library/react-hooks';
import { entity } from '../../public-api/Entity';
import { useMutation } from '../useMutation';

const item = entity();
const mutate = jest.fn().mockResolvedValue(true);

test('debounce', async () => {
  jest.useFakeTimers();
  const { result, waitForNextUpdate } = renderHook(() => useMutation(item(), {
    mutate,
    mutateOptions: {
      debounce: 256,
    },
  }));

  const [setState] = result.current;

  expect(result.current[1].loading).toBe(false);

  act(() => {
    setState(1);
  });
  act(() => {
    setState(2);
  });
  act(() => {
    setState(3);
  });

  expect(mutate).not.toHaveBeenCalled();
  expect(result.current[1].loading).toBe(false);

  jest.advanceTimersByTime(255);
  expect(mutate).not.toHaveBeenCalled();
  expect(result.current[1].loading).toBe(false);
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(mutate).toHaveBeenCalledTimes(1);
  expect(mutate).toHaveBeenCalledWith(3, [], undefined);
  expect(result.current[1].loading).toBe(true);
  await waitForNextUpdate();
  expect(result.current[1].loading).toBe(false);
  jest.useRealTimers();
});
