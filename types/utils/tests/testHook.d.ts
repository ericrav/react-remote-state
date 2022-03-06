import { WaitForNextUpdate } from '@testing-library/react-hooks';
export declare function testHook<P extends any[], R, T extends (...args: P) => R>(hook: T): readonly [T, {
    waitForNextUpdate: WaitForNextUpdate;
}];
