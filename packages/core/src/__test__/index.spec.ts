import * as Exports from '..';
import { ChocoBotCore } from '../core';
import { ChocoPlatform } from '../platform';

describe('module(@team-choco/core)', () => {
  it('should match expected exports', () => {
    expect(Exports).toEqual({
      ChocoBotCore,
      ChocoPlatform,
    });
  });
});
