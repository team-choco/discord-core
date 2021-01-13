import { sinon, chance, SinonStub, wait } from '@team-choco/test-helpers';
import { ChocoBotCore, ChocoMessage } from '@team-choco/core';

import { ChocoCommandPlugin } from '../plugin';

describe('class(ChocoCommandPlugin)', () => {
  let bot: ChocoBotCore;
  beforeEach(() => {
    bot = {
      on: sinon.stub(),
      emit: sinon.stub(),
    } as unknown as ChocoBotCore;
  });

  describe('func(register)', () => {
    it('should create the "command" function on the bot', () => {
      const plugin = new ChocoCommandPlugin({
        prefix: '!',
      });

      expect(bot.command).toBeUndefined();

      plugin.register(bot);

      expect(bot.command).toBeInstanceOf(Function);
    });
  });

  describe('func(command)', () => {
    it('should register commands', () => {
      const plugin = new ChocoCommandPlugin({
        prefix: '!',
      });

      plugin.register(bot);

      expect(bot.commands).toHaveLength(0);

      bot.command(chance.word(), sinon.stub());

      expect(bot.commands).toHaveLength(1);
    });
  });

  describe('func(prefix)', () => {
    it('should support returning a basic prefix', async () => {
      const expectedPrefix = chance.string();
      const expectedMessage = {} as ChocoMessage;

      const plugin = new ChocoCommandPlugin({
        prefix: expectedPrefix,
      });

      const prefix = await plugin.prefix(expectedMessage);

      expect(prefix).toEqual(expectedPrefix);
    });

    it('should support returning a dynamic prefix', async () => {
      let expectedPrefix;
      const expectedMessage = {} as ChocoMessage;

      const plugin = new ChocoCommandPlugin({
        prefix: (message) => {
          expect(message).toEqual(expectedMessage);

          expectedPrefix = chance.string();
          return expectedPrefix;
        },
      });

      const prefix = await plugin.prefix(expectedMessage);

      expect(prefix).toBeTruthy();
      expect(prefix).toEqual(expectedPrefix);
    });
  });

  describe('event(message)', () => {
    let phrase: string;
    let command: SinonStub;

    beforeEach(() => {
      phrase = chance.word();
      command = sinon.stub();

      const plugin = new ChocoCommandPlugin({
        prefix: '!',
      });

      plugin.register(bot);

      bot.command(phrase, command);
    });


    it('should register commands', async () => {
      sinon.assert.notCalled(command);

      (bot.on as SinonStub).getCalls()
        .filter(({ args }) => args[0] === 'message')
        .forEach(({ args }) => args[1]({
          content: '!' + phrase,
        }));

      await wait();

      sinon.assert.calledOnce(command);
    });

    it('should bail early if no prefix is specified', async () => {
      sinon.assert.notCalled(command);

      (bot.on as SinonStub).getCalls()
        .filter(({ args }) => args[0] === 'message')
        .forEach(({ args }) => args[1]({
          content: phrase,
        }));

      await wait();

      sinon.assert.notCalled(command);
    });

    it('should bail early if no command is found', async () => {
      sinon.assert.notCalled(command);

      (bot.on as SinonStub).getCalls()
        .filter(({ args }) => args[0] === 'message')
        .forEach(({ args }) => args[1]({
          content: '!' + chance.word(),
        }));

      await wait();

      sinon.assert.notCalled(command);
    });
  });
});
