import { Entity, entity, __test_reset_entity_key } from '../Entity';

beforeEach(() => {
  __test_reset_entity_key();
});

test('entity', async () => {
  const note: Entity<string, string> = entity<string, string>({
    query: (id) => Promise.resolve(note(id)('note value')),
  });
  expect(note('5')('value')).toMatchInlineSnapshot(`
Object {
  "key": "entity-1-5",
  "value": "value",
}
`);
  const value = await note('3').options?.query?.('3');
  expect(value).toEqual({ key: 'entity-1-3', value: 'note value' });
});

interface User {
  id: string;
  profile: {
    name: string;
    age: number;
  }
}
