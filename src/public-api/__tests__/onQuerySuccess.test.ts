import { renderHook } from '@testing-library/react-hooks';
import { entity } from '../Entity';
import { useRemoteState } from '../useRemoteState';

const itemList = entity({
  defaultValue: [] as string[],
  onQuerySuccess: (list) => list.map((name) => item(name)({ name })),
});
const item = entity();

test('list query update items', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useRemoteState(item('A')));
  {
    const [state] = result.current;
    expect(state).toBeUndefined();
  }

  renderHook(() => useRemoteState(itemList(), { query: () => ['A', 'B'] }));

  await waitForNextUpdate();

  {
    const [state] = result.current;
    expect(state).toEqual({ name: 'A' });
  }
});
