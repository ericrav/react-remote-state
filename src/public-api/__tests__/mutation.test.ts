import { act, renderHook } from '@testing-library/react-hooks';
import { entity } from '../Entity';
import { useRemoteState } from '../useRemoteState';

interface Item {
  id: string;
  title: string;
  count: number;
}

const emptyItem = entity();
const querySpy = jest.fn((id: string) => Promise.resolve({ id, title: 'Foobar', count: 7 } as Item));
const mutateSpy = jest.fn((newValue: Item): Promise<Item> => Promise.resolve(newValue));
const itemWithOptions = entity({
  query: querySpy,
  mutate: mutateSpy,
});

test('emptyItem', async () => {
  const { result } = renderHook(() => useRemoteState(emptyItem()));
  {
    const [state, setState] = result.current;
    expect(state).toBeUndefined();
    act(() => {
      setState({ foo: 'bar' });
    });
  }
  {
    const [state] = result.current;
    expect(state).toEqual({ foo: 'bar' });
  }
});

test('itemWithOptions', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useRemoteState(itemWithOptions('item1')));
  {
    const [state] = result.current;
    expect(state).toBeUndefined();
  }
  await waitForNextUpdate();
  expect(querySpy).toHaveBeenCalledWith('item1');
  {
    const [state, setState] = result.current;
    expect(state).toEqual({ id: 'item1', title: 'Foobar', count: 7 });
    act(() => {
      setState({ id: 'item1', title: 'Baz', count: 8 });
    });
    expect(mutateSpy).toHaveBeenCalledWith({ id: 'item1', title: 'Baz', count: 8 }, 'item1');
  }
});

test('setState captures closure', async () => {
  const { result, waitForNextUpdate, rerender } = renderHook((options: any) => useRemoteState(itemWithOptions('item1'), options));
  const [, setState1] = result.current;

  const mutate2 = jest.fn();
  rerender({ mutate: mutate2 });
  const [, setState2] = result.current;

  expect(mutateSpy).not.toHaveBeenCalled();
  expect(mutate2).not.toHaveBeenCalled();

  act(() => {
    setState1({ id: 'item1', title: 'Baz', count: 8 });
  });
  await waitForNextUpdate();
  expect(mutateSpy).toHaveBeenCalledWith({ id: 'item1', title: 'Baz', count: 8 }, 'item1');
  expect(mutate2).not.toHaveBeenCalled();

  mutateSpy.mockClear();
  act(() => {
    setState2({ id: 'item1', title: 'Baz', count: 9 });
  });
  expect(mutateSpy).not.toHaveBeenCalled();
  expect(mutate2).toHaveBeenCalledWith({ id: 'item1', title: 'Baz', count: 9 }, 'item1');
});
