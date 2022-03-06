import { useEffect } from 'react';
import { EntityById } from '../public-api/Entity';
import { RemoteStateOptions } from '../public-api/RemoteStateOptions';

export function useQuery<P, T>(entity: EntityById<P, T>, options: RemoteStateOptions<P, T> = {}) {
  const query = options.query ?? entity.options?.query;

  useEffect(() => {
    console.log(query);
  });
}
