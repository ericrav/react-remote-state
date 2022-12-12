import { act } from '@testing-library/react-hooks';
import { testHook } from '../../utils/tests/testHook';
import { entity } from '../Entity';
import { useRemoteState } from '../useRemoteState';

const item = entity();

test('default value', () => {
  const [useTestRemoteState] = testHook(useRemoteState);
  {
    const [state] = useTestRemoteState(item(), { defaultValue: 'Starting value' });
    expect(state).toEqual('Starting value');
  }
  {
    const [state] = useTestRemoteState(item(), { defaultValue: 'changed default value is ignored' });
    expect(state).toEqual('Starting value');
  }
});

test('update initial value if id key change', () => {
  const [useTestRemoteState, hook] = testHook(useRemoteState);

  {
    const id = 'test1';
    const [state] = useTestRemoteState(item(id), { defaultValue: 'value1' });

    expect(state).toEqual('value1');
  }
  {
    const id = 'test2';
    const [state] = useTestRemoteState(item(id), { defaultValue: 'value2' });

    expect(state).toEqual('value2');
    expect(hook.result.all.length).toBe(2);
  }
});

test('queries when param changes', async () => {
  const [useTestRemoteState, hook] = testHook(useRemoteState);
  const ent = entity<[string], { data: string }>({ query: (id) => Promise.resolve({ data: id }) });
  const useHook = () => useTestRemoteState(ent('test1'));
  type UseHook = typeof useHook;
  type HookResult = ReturnType<UseHook>;
  useTestRemoteState(ent('test1'));
  {
    const [state,, { query }] = hook.result.current as HookResult;
    expect(state).toEqual(undefined);
    expect(query.loading).toBe(true);
    expect(hook.result.all).toHaveLength(2);
  }

  {
    await hook.waitForNextUpdate();
    const [state,, { query }] = hook.result.current as HookResult;
    expect(state).toEqual({ data: 'test1' });
    expect(query.loading).toBe(false);
    expect(hook.result.all.length).toBe(5);
  }

  useTestRemoteState(ent('test2'));
  {
    const [state,, { query }] = hook.result.all[5] as HookResult;
    expect(state).toEqual(undefined);
    expect(query.loading).toBe(true);
    expect(hook.result.all).toHaveLength(7);
  }
  {
    const [state,, { query }] = hook.result.all[6] as HookResult;
    expect(state).toEqual(undefined);
    expect(query.loading).toBe(true);
    expect(hook.result.all).toHaveLength(7);
  }

  {
    await hook.waitForNextUpdate();
    const [state,, { query }] = hook.result.current as HookResult;
    expect(state).toEqual({ data: 'test2' });
    expect(query.loading).toBe(false);
    expect(hook.result.all.length).toBe(10);
  }
});

test('query function', async () => {
  const [useTestRemoteState, hook] = testHook(useRemoteState);
  {
    const [state,, { query }] = useTestRemoteState(item(), { query: () => Promise.resolve('data') });
    expect(state).toEqual(undefined);
    expect(query.loading).toEqual(true);
  }
  await hook.waitForNextUpdate();
  {
    const [state,, { query }] = useTestRemoteState(item(), { query: () => Promise.resolve('data') });
    expect(state).toEqual('data');
    expect(query.loading).toEqual(false);
  }

  interface Test {
    name: string;
    count: number;
  }
  const testEnt = entity<[string, number], Test>();
  useTestRemoteState(testEnt('argument', 2), { query: (name, count) => ({ name, count }) });
  await hook.waitForNextUpdate();
  {
    const [state] = useTestRemoteState(testEnt('argument', 2));
    expect(state).toEqual({ count: 2, name: 'argument' });
  }
});

test('caching', async () => {
  const [useInstance1] = testHook(useRemoteState);
  const [useInstance2] = testHook(useRemoteState);
  {
    const [, setState] = useInstance1(item());
    act(() => setState('value'));
  }
  {
    const [state] = useInstance2(item());
    expect(state).toEqual('value');
  }
});
