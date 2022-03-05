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
  "key": "5",
  "options": Object {
    "query": [Function],
  },
  "value": "value",
}
`);
  const value = await note('3').options?.query?.('3');
  expect(value).toEqual({ key: '3', value: 'note value', options: expect.any(Object) });
});

test('derive entities', () => {
  const User = entity<string, { id: string }>();
  const UserList = entity<void, { id: string }[]>({
    derive: (list) => list.map((user) => User(user.id)(user)),
  });

  const { value, options: { derive } } = UserList()([
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]);
  expect(derive!(value)).toEqual([
    User('1')({ id: '1' }),
    User('2')({ id: '2' }),
    User('3')({ id: '3' }),
  ]);
});
