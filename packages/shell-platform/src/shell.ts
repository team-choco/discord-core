import readline from 'readline';

import { ChocoPlatform, ChocoMessage, ChocoUser, ChocoMessageOptions } from '@team-choco/core';
import { convertChocoMessageOptionsToContent } from './utils/converter';

export class ChocoShellPlatform extends ChocoPlatform {
  private options: ChocoShellPlatformInternalOptions;
  private rl: readline.Interface;

  constructor(options: ChocoShellPlatformOptions) {
    super();
    this.options = {
      whoami: 'User',
      ...options,
    };

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.onMessage = this.onMessage.bind(this);
  }

  info(): ChocoUser {
    return {
      id: this.options.name,
      username: this.options.name,
    };
  }

  async login(): Promise<void> {
    this.rl.on('line', this.onMessage);

    await new Promise((resolve) => setTimeout(resolve, 0));

    this.emit('ready');
  }

  protected async pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessage> {
    const info = this.info();

    const content = convertChocoMessageOptionsToContent(options);

    await this.write(this.options.name, content);

    return {
      author: {
        id: info.id,
        username: info.username,
      },
      content: content,
      reply: this.send.bind(this, channelID),
    };
  }

  async destroy(): Promise<void> {
    this.rl.close();
  }

  private async onMessage(message: string) {
    const match = message.match(/^(?:<([^>]+)>:)?(.+)/);

    if (!match) return;

    const [, who, content] = match;

    if ([this.options.name, this.options.whoami].includes(who)) return;

    // Handle it!
    if (!who) {
      await this.clear(-1);
      await this.write(this.options.whoami, content);
    }

    this.emit('message', {
      author: {
        id: who || this.options.whoami,
        username: who || this.options.whoami,
      },
      content: content.trim(),
      reply: this.send.bind(this, ''),
    });
  }

  private async clear(line: number) {
    await new Promise((resolve) => readline.moveCursor(process.stdout, 0, line, resolve));

    await new Promise((resolve) => readline.clearLine(process.stdout, 0, resolve));
  }

  private async write(who: string, message: string) {
    for (const content of message.split('\n')) {
      this.rl.write(`<${who}>: ${content}\n`);
    }
  }
}

export interface ChocoShellPlatformInternalOptions extends ChocoShellPlatformOptions {
  whoami: string;
}

export interface ChocoShellPlatformOptions {
  /**
   * The bots username.
   */
  name: string;

  /**
   * Your username.
   *
   * @defaultValue 'user'
   */
  whoami?: string;
}
