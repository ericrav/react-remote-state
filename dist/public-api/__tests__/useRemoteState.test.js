var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    const [useTestRemoteState] = testHook(useRemoteState);
    {
        const id = 'test1';
        const [state] = useTestRemoteState(item(id), { defaultValue: 'value1' });
        expect(state).toEqual('value1');
    }
    {
        const id = 'test2';
        const [state] = useTestRemoteState(item(id), { defaultValue: 'value2' });
        expect(state).toEqual('value2');
    }
});
test('query function', () => __awaiter(void 0, void 0, void 0, function* () {
    const [useTestRemoteState, hook] = testHook(useRemoteState);
    {
        const [state, , { loading }] = useTestRemoteState(item(), { query: () => Promise.resolve('data') });
        expect(state).toEqual(undefined);
        expect(loading).toEqual(true);
    }
    yield hook.waitForNextUpdate();
    {
        const [state, , { loading }] = useTestRemoteState(item(), { query: () => Promise.resolve('data') });
        expect(state).toEqual('data');
        expect(loading).toEqual(false);
    }
    const testEnt = entity();
    useTestRemoteState(testEnt('argument', 2), { query: (name, count) => ({ name, count }) });
    yield hook.waitForNextUpdate();
    {
        const [state] = useTestRemoteState(testEnt('argument', 2));
        expect(state).toEqual({ count: 2, name: 'argument' });
    }
}));
test('caching', () => __awaiter(void 0, void 0, void 0, function* () {
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
}));
