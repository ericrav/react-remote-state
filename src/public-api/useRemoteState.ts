import { useState } from 'react';
import { RemoteStateOptions } from './RemoteStateOptions';

export function useRemoteState<T>(args: string, options: RemoteStateOptions<T>) {
  const [state, setState] = useState(options.defaultValue);
  return [state, setState] as const;
}
