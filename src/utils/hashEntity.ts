import { EntityById } from '../public-api/Entity';

export const hashEntity = (entity: EntityById<any, any>) => entity.params.join('$');
