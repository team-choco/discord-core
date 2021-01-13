import { chance, sinon } from '@team-choco/test-helpers';
import { ChocoArgs } from '../../args';

import { ChocoCommand } from '../command';
import { ChocoCommandListenerDetails } from '../types';

describe('class(ChocoCommand)', () => {
  describe('func(constructor)', () => {
    it('should create a ChocoCommand', () => {
      const command = new ChocoCommand({
        listener: sinon.stub(),
        pattern: chance.word(),
      });

      expect(command).toBeInstanceOf(ChocoCommand);
    });
  });

  describe('func(parse)', () => {
    it('should parse the message', () => {
      const message = chance.word();
      const command = new ChocoCommand({
        listener: sinon.stub(),
        pattern: message,
      });

      const args = command.parse(message) as ChocoArgs;

      expect(args).toEqual({
        _: [],
      });
    });

    it('should return null if the message does not match', () => {
      const command = new ChocoCommand({
        listener: sinon.stub(),
        pattern: chance.word(),
      });

      const args = command.parse(chance.word()) as ChocoArgs;

      expect(args).toEqual(null);
    });
  });

  describe('func(exec)', () => {
    it('should execute the listener', async () => {
      const listener = sinon.stub();
      const command = new ChocoCommand({
        listener,
        pattern: chance.word(),
      });

      sinon.assert.notCalled(listener);

      await command.exec({} as ChocoCommandListenerDetails);

      sinon.assert.calledOnce(listener);
    });

    it('should return null if the message does not match', () => {
      const command = new ChocoCommand({
        listener: sinon.stub(),
        pattern: chance.word(),
      });

      const args = command.parse(chance.word()) as ChocoArgs;

      expect(args).toEqual(null);
    });
  });
});
