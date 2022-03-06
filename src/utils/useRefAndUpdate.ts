import { useRef } from 'react';

export const useRefAndUpdate = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
