var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { entity } from '../Entity';
test('entity', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const note = entity({
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
    const value = yield ((_b = (_a = note('3').options) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.call(_a, '3'));
    expect(value).toEqual({ key: '3', value: 'note value', options: expect.any(Object) });
}));
test('derive entities', () => {
    const User = entity();
    const UserList = entity({
        derive: (list) => list.map((user) => User(user.id)(user)),
    });
    const { value, options: { derive } } = UserList()([
        { id: '1' },
        { id: '2' },
        { id: '3' },
    ]);
    expect(derive(value)).toEqual([
        User('1')({ id: '1' }),
        User('2')({ id: '2' }),
        User('3')({ id: '3' }),
    ]);
});
