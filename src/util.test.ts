import {flatten, maxPrecision} from './util';

type TestData<T extends (...args: any[]) => unknown> = {
  name: string;
  params: Parameters<T>;
  expected: ReturnType<T>;
};

const flattenTests: TestData<typeof flatten>[] = [
  {
    name: 'multidimensional array',
    params: [[1, 2, [3, [[4], 5]], 6]],
    expected: [1, 2, 3, 4, 5, 6],
  },
  {
    name: 'nested objects',
    params: [{ hello: 1, world: [2, 3, { foo: [[4]] }] }],
    expected: [1, 2, 3, 4],
  },
];

for (const {expected, name, params} of flattenTests) {
  test(`flatten: ${name}`, () => {
    const actual = flatten(...params);
    expect(actual).toEqual(expected);
  });
}

const maxPrecisionTests: TestData<typeof maxPrecision>[] = [
  {
    name: 'rounding up',
    params: [2.1284],
    expected: 2.13,
  },
  {
    name: 'rounding down',
    params: [2.1214],
    expected: 2.12,
  },
  {
    name: 'rounding up, 3 digits',
    params: [2.12184, 3],
    expected: 2.122,
  },
  {
    name: 'rounding down, 3 digits',
    params: [2.1214, 3],
    expected: 2.121,
  },
];

for (const {expected, name, params} of maxPrecisionTests) {
  test(`maxPrecision: ${name}`, () => {
    const actual = maxPrecision(...params);
    expect(actual).toEqual(expected);
  });
}
