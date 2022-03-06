import { entity } from '../../public-api/Entity';
import { testHook } from '../tests/testHook';
import { useQuery } from '../useQuery';

it('should dedupe queries', async () => {
  const [useQ1, hook] = testHook(useQuery);
  const [useQ2] = testHook(useQuery);
  const query = jest.fn().mockResolvedValue(true);
  const foobar = entity<[number], any>({ query });
  useQ1(foobar(1));
  useQ2(foobar(1));
  await hook.waitForNextUpdate();

  expect(query).toHaveBeenCalledTimes(1);
});
