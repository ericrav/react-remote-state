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

it('shares loading states', async () => {
  const [useQ1] = testHook(useQuery);
  const [useQ2] = testHook(useQuery);
  const query = jest.fn(() => new Promise(() => {}));
  const foobar = entity<[number], any>({ query });
  {
    const { loading } = useQ1(foobar(1));
    expect(loading).toBe(true);
  }
  {
    const { loading } = useQ2(foobar(1));
    expect(loading).toBe(true);
  }
});

it('revalidates query after set time', async () => {
  jest.spyOn(Date, 'now');

  const timeSpy = (Date.now) as jest.Mock;

  const [useQ1, hook1] = testHook(useQuery);
  const [useQ2] = testHook(useQuery);
  const [useQ3, hook3] = testHook(useQuery);

  const query = jest.fn().mockResolvedValue(true);
  const queryTTL = 30000;
  const foobar = entity({ query });

  timeSpy.mockReturnValue(0);
  useQ1(foobar(), { queryTTL });
  await hook1.waitForNextUpdate();
  expect(query).toHaveBeenCalledTimes(1);

  timeSpy.mockReturnValue(queryTTL - 1);
  useQ2(foobar(), { queryTTL });
  expect(query).toHaveBeenCalledTimes(1);

  timeSpy.mockReturnValue(queryTTL + 1);
  useQ3(foobar(), { queryTTL });
  await hook3.waitForNextUpdate();
  expect(query).toHaveBeenCalledTimes(2);
});
