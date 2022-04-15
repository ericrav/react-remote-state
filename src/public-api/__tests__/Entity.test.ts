import { Entity, entity } from '../Entity';

test('entity', async () => {
  const note: Entity<[id: string], string> = entity({
    query: (id) => Promise.resolve(`note value ${id}`),
  });
  expect(note('5')('value')).toMatchInlineSnapshot(`
Object {
  "entity": [Function],
  "value": "value",
}
`);
  expect(note('5')('value').entity.scope).toEqual(note('5').scope);
  expect(note('5')('value').entity.params).toEqual(note('5').params);
  const value = await note('3').options?.query?.('3');
  expect(value).toEqual('note value 3');
});

test('derive entities', () => {
  const User = entity<string, { id: string }>();
  const UserList = entity<void, { id: string }[]>({
    derive: (list) => list.map((user) => User(user.id)(user)),
  });

  const { derive } = UserList().options;
  const { value } = UserList()([
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]);
  expect(derive!(value as { id: string }[])).toEqual([
    { entity: expect.objectContaining({ params: ['1'] }), value: { id: '1' } },
    { entity: expect.objectContaining({ params: ['2'] }), value: { id: '2' } },
    { entity: expect.objectContaining({ params: ['3'] }), value: { id: '3' } },
  ]);
});
