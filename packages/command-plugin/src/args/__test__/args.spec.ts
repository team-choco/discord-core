import { chance } from '@team-choco/test-helpers';

import { toChocoArgs } from '../args';
import { PositionalArgumentDetails } from '../../pattern';

describe('struct(ChocoArgs)', () => {
  describe('func(toArgs)', () => {
    it('should convert a command to ChocoArgs', () => {
      const command = chance.word();

      const args = toChocoArgs(command, []);

      expect(args._).toEqual([command]);
    });

    it('should support positional args', () => {
      const name = chance.word();
      const value = chance.word()

      const args = toChocoArgs(value, [{
        name,
        rest: false,
      }]);

      expect(args._).toEqual([]);
      expect(args[name]).toEqual(value);
    });

    it(`shouldn't modify the incoming args`, () => {
      const name = chance.word();
      const value = chance.word()

      const argDetails: PositionalArgumentDetails[] = [{
        name,
        rest: false,
      }];

      const args = toChocoArgs(value, argDetails);

      expect(argDetails).toHaveLength(1);
      expect(args._).toEqual([]);
      expect(args[name]).toEqual(value);
    });

    it('should support rest args', () => {
      const name = chance.word();
      const value = `${chance.word()} ${chance.word()}`

      const args = toChocoArgs(value, [{
        name,
        rest: true,
      }]);

      expect(args._).toEqual([]);
      expect(args[name]).toEqual(value);
    });

    it('should support positional args mixed with rest args', () => {
      const name = chance.word();
      const restName = chance.word();
      const value = chance.word();
      const restValue = `${chance.word()} ${chance.word()}`;

      const args = toChocoArgs(`${value} ${restValue}`, [{
        name,
        rest: false,
      }, {
        name: restName,
        rest: true,
      }]);

      expect(args._).toEqual([]);
      expect(args[name]).toEqual(value);
      expect(args[restName]).toEqual(restValue);
    });

    it('should support option args', () => {
      const name = chance.word();
      const value = chance.word();

      const args = toChocoArgs(`--${name} ${value}`, []);

      expect(args._).toEqual([]);
      expect(args[name]).toEqual(value);
    });

    it('should support option args with no value', () => {
      const name = chance.word();

      const args = toChocoArgs(`--${name}`, []);

      expect(args._).toEqual([]);
      expect(args[name]).toEqual(true);
    });

    it('should support option args mixed with positional args', () => {
      const positional = chance.word();
      const name = chance.word();
      const value = chance.word();

      const args = toChocoArgs(`${positional} --${name} ${value}`, []);

      expect(args._).toEqual([positional]);
      expect(args[name]).toEqual(value);
    });
  });
});
