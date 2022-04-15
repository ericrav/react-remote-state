import { act, renderHook } from '@testing-library/react-hooks';
import { entity } from '../Entity';
import { useRemoteState } from '../useRemoteState';

const itemList = entity({
  defaultValue: [] as string[],
});
const item = entity({
  mutate: (name: string) => name,
  onMutateSuccess: (name) => itemList()((list) => [name, ...list]),
});

test('mutate item updates itemList', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useRemoteState(itemList()));
  {
    const [state] = result.current;
    expect(state).toEqual([]);
  }

  const { result: itemResult } = renderHook(() => useRemoteState(item('A')));

  act(() => {
    const [, setState] = itemResult.current;
    setState('Alfred');
  });

  await waitForNextUpdate();

  {
    const [state] = result.current;
    expect(state).toEqual(['Alfred']);
  }

  act(() => {
    const [, setState] = itemResult.current;
    setState('Bob');
  });

  await waitForNextUpdate();

  {
    const [state] = result.current;
    expect(state).toEqual(['Bob', 'Alfred']);
  }
});
