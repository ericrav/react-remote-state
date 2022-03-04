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
