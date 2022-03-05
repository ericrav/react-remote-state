import { act } from '@testing-library/react-hooks';
import { testHook } from '../../utils/tests/testHook';
import { useRemoteState } from '../useRemoteState';

test('default value', () => {
  const [useTestRemoteState] = testHook(useRemoteState);
  {
    const [state] = useTestRemoteState('test', { defaultValue: 'Starting value' });
    expect(state).toEqual('Starting value');
  }
  {
    const [state] = useTestRemoteState('test', { defaultValue: 'changed default value is ignored' });
    expect(state).toEqual('Starting value');
  }
});

test('update initial value if id key change', () => {
  const [useTestRemoteState] = testHook(useRemoteState);
  {
    const id = 'test1';
    const [state] = useTestRemoteState(id, { defaultValue: 'value1' });
    expect(state).toEqual('value1');
  }
  {
    const id = 'test2';
    const [state] = useTestRemoteState(id, { defaultValue: 'value2' });
    expect(state).toEqual('value2');
  }
});

test('query function', async () => {
  const [useTestRemoteState, hook] = testHook(useRemoteState);
  {
    const [state,, { loading }] = useTestRemoteState('test1', { query: () => Promise.resolve('data') });
    expect(state).toEqual(undefined);
    expect(loading).toEqual(true);
  }
  await hook.waitForNextUpdate();
  {
    const [state,, { loading }] = useTestRemoteState('test1', { query: () => Promise.resolve('data') });
    expect(state).toEqual('data');
    expect(loading).toEqual(false);
  }
});

test('caching', async () => {
  const [useInstance1] = testHook(useRemoteState);
  const [useInstance2] = testHook(useRemoteState);
  {
    const [, setState] = useInstance1('id', { meta: 'hook1' });
    act(() => setState('value'));
  }
  {
    const [state] = useInstance2('id', { meta: 'hook2' });
    expect(state).toEqual('value');
  }
});
