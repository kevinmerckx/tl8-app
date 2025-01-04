import { getValueAtPath } from './get-value-at-path';

describe('getValueAtPath', () => {
  it('gets the value', () => {
    expect(getValueAtPath({ b: { c: 1, a: 2 } }, ['b', 'a'])).toEqual(2);
    expect(getValueAtPath({ b: { c: 1, a: 0 } }, ['b', 'a'])).toEqual(0);
    expect(getValueAtPath({ b: { c: 1, a: { d: 2 } } }, ['b', 'a'])).toEqual({
      d: 2,
    });
  });
});
