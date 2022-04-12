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

  jest.advanceTimersByTime(255);
  expect(mutate).not.toHaveBeenCalled();
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(mutate).toHaveBeenCalledTimes(1);
  expect(mutate).toHaveBeenCalledWith(3);
  await waitForNextUpdate();
  jest.useRealTimers();
});
