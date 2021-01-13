import { chance, sinon, SinonSpyCall, SinonSpy } from '@team-choco/test-helpers';

import { ChocoBotCore, ChocoPlugin } from '../core';
import { ChocoMessage, ChocoMessageOptions, ChocoPlatform, ChocoUser } from '../platform';

class MockPlatform extends ChocoPlatform {
  info(required: true): ChocoUser;
  info(required?: boolean): (null|ChocoUser);
  info(required?: boolean): (null|ChocoUser) {
    throw new Error('Method not implemented.');
  }

  public login = sinon.stub().resolves();
  public status = sinon.stub().resolves();
  public destroy = sinon.stub().resolves();
  public on = sinon.stub();

  public message(serverID: string, channelID: string, messageID: string): Promise<ChocoMessage | null> {
    throw new Error('Method not implemented.');
  }

  protected pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessage> {
    throw new Error('Method not implemented.');
  }

  protected pristineEdit(channelID: string, messageID: string, options: ChocoMessageOptions): Promise<ChocoMessage> {
    throw new Error('Method not implemented.');
  }

  protected pristineReact(channelID: string, messageID: string, emoji: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

describe('Class(Bot)', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('func(constructor)', () => {
    it('should construct a bot', () => {
      const bot = new ChocoBotCore({
        platform: new MockPlatform(),
      });

      expect(bot).toBeTruthy();
    });

    it('should automatically login', () => {
      const bot = new ChocoBotCore({
        platform: new MockPlatform(),
      });

      expect(bot).toBeTruthy();
      sinon.assert.calledOnce(bot.platform.login as SinonSpy);
    });

    it('should register a "message" listener', () => {
      const bot = new ChocoBotCore({
        platform: new MockPlatform(),
      });

      expect(bot).toBeTruthy();
      sinon.assert.calledTwice(bot.platform.on as SinonSpy);
      sinon.assert.calledWith(bot.platform.on as SinonSpy, 'message');
    });

    it('should register a "ready" listener', () => {
      const bot = new ChocoBotCore({
        platform: new MockPlatform(),
      });

      expect(bot).toBeTruthy();
      sinon.assert.calledTwice(bot.platform.on as SinonSpy);
      sinon.assert.calledWith(bot.platform.on as SinonSpy, 'ready');
    });

    describe('prop(plugins)', () => {
      it('should register any plugins provided', () => {
        class CustomPlugin implements ChocoPlugin {
          register(bot: ChocoBotCore) {
            expect(bot).toBeInstanceOf(ChocoBotCore);
          }
        }

        const register = sinon.spy(CustomPlugin.prototype, 'register');

        sinon.assert.notCalled(register);

        const bot = new ChocoBotCore({
          platform: new MockPlatform(),

          plugins: [
            new CustomPlugin(),
          ],
        });

        expect(bot).toBeTruthy();
        sinon.assert.calledOnce(register);
      });
    });
  });

  describe('event(message)', () => {
    it('should emit the event when the client emits a "message" event', async () => {
      const bot = new ChocoBotCore({
        platform: new MockPlatform(),
      });

      const call = (bot.platform.on as SinonSpy).getCalls().find((call) =>
        call.args.includes('message'),
      ) as SinonSpyCall;

      expect(call).toBeTruthy();

      const [, listener] = call.args;

      expect(listener).toBeInstanceOf(Function);

      const expectedMessage = chance.string();

      const message = await new Promise((resolve) => {
        bot.once('message', resolve);

        listener(expectedMessage);
      });

      expect(message).toEqual(expectedMessage);
    });
  });

  describe('event(ready)', () => {
    it('should emit the event when the client emits a "ready" event', async () => {
      const bot = new ChocoBotCore({
        platform: new MockPlatform(),
      });

      const call = (bot.platform.on as SinonSpy).getCalls().find((call) =>
        call.args.includes('ready'),
      ) as SinonSpyCall;

      expect(call).toBeTruthy();

      const [, listener] = call.args;

      expect(listener).toBeInstanceOf(Function);

      await new Promise((resolve) => {
        bot.once('ready', () => resolve(null));

        listener();
      });
    });
  });

  describe('func(register)', () => {
    it('should register the plugin', async () => {
      const bot = new ChocoBotCore({
        platform: new MockPlatform(),
      });

      class CustomPlugin implements ChocoPlugin {
        register(bot: ChocoBotCore) {
          expect(bot).toBeInstanceOf(ChocoBotCore);
        }
      }

      const register = sinon.spy(CustomPlugin.prototype, 'register');

      sinon.assert.notCalled(register);

      bot.register(new CustomPlugin());

      expect(bot).toBeTruthy();
      sinon.assert.calledOnce(register);
    });
  });

  describe('func(destroy)', () => {
    it('should destroy the client', async () => {
      const bot = new ChocoBotCore({
        platform: new MockPlatform(),
      });

      sinon.assert.notCalled(bot.platform.destroy as SinonSpy);

      bot.destroy();

      sinon.assert.calledOnce(bot.platform.destroy as SinonSpy);
    });
  });
});
