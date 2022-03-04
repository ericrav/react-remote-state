import { renderHook } from '@testing-library/react-hooks';
import { useRemoteState } from '../useRemoteState';

it('returns values', () => {
  const { result } = renderHook(() => useRemoteState());
  expect(result.current).toEqual(['state', 'setState']);
});
