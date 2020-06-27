import { Client, Message, TextChannel, DMChannel, Channel, MessageOptions, MessageEmbedOptions } from 'discord.js';

import { ChocoPlatform, ChocoMessage, ChocoUser, ChocoMessageOptions } from '@team-choco/core';

export class ChocoDiscordPlatform extends ChocoPlatform {
  private client: Client;
  private options: ChocoDiscordPlatformOptions;

  constructor(options: ChocoDiscordPlatformOptions) {
    super();
    this.options = options;

    this.client = new Client();

    this.onMessage = this.onMessage.bind(this);
  }

  async login(): Promise<void> {
    this.client.on('message', this.onMessage);
    this.client.once('ready', () => this.emit('ready'));

    await this.client.login(this.options.token);
  }

  info(required: true): ChocoUser;
  info(required?: boolean): (null|ChocoUser);
  info(required?: boolean): (null|ChocoUser) {
    if (!this.client.user || !this.client.user.id || !this.client.user.username) {
      if (required) {
        throw new Error(`Expected bot to be authenticated!`);
      } else {
        return null;
      }
    }

    return {
      id: this.client.user.id,
      username: this.client.user.username,
    };
  }

  async pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessage> {
    const info = this.info(true);

    const channel = await this.client.channels.fetch(channelID);

    if (!this.isTextBasedChannel(channel)) {
      throw new Error(`Channel must be either a "text" or "dm" channel. (${channelID})`);
    }

    const embed: (undefined|MessageEmbedOptions) = options.embed ? {
      ...(options.embed.title ? {
        title: options.embed.title.content,
        url: options.embed.title.url,
      } : undefined),
      description: options.embed.content,
      color: options.embed.color ? parseInt(options.embed.color, 16) : undefined,
      fields: options.embed.fields,
      footer: options.embed.footer ? {
        text: options.embed.footer.content,
        iconURL: options.embed.footer.iconURL,
      } : undefined,
    } : undefined;

    const content: MessageOptions = {
      content: options.content,
      embed: embed,
    };

    const message = await channel.send(content);

    return {
      author: {
        id: info.id,
        username: info.username,
      },
      content: message.content,
      reply: this.send.bind(this, channelID),
    };
  }

  async destroy(): Promise<void> {
    this.client.destroy();
  }

  private async onMessage(message: Message) {
    this.emit('message', {
      author: {
        id: message.author.id,
        username: message.author.username,
      },
      content: message.content,
      reply: this.send.bind(this, message.channel.id),
    });
  }

  private isTextBasedChannel(channel: Channel): channel is (DMChannel|TextChannel) {
    return ['dm', 'text'].includes(channel.type);
  }
}

export interface ChocoDiscordPlatformOptions {
  /**
   * The Discord API Token.
   */
  token: string;
}
