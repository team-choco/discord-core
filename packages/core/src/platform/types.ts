import { EventEmitter } from 'events';

export abstract class ChocoPlatform extends EventEmitter {
  /**
   * Pulls down the bots user information.
   * @returns the bot user info.
   */
  public abstract info(): (null|ChocoUser);
  public abstract info(required: true): ChocoUser;
  public abstract info(required?: boolean): (null|ChocoUser);

  /**
   * Authenticates the user with the platform.
   */
  public abstract login(): Promise<void>;

  /**
   * Sends a message.
   *
   * @param channelID - the id of the channel to send the message to.
   * @param message - the message to send.
   * @returns the updated message
   */
  public send(channelID: string, message: (string|ChocoMessageOptions)): Promise<ChocoMessage> {
    if (typeof message === 'string') {
      return this.send(channelID, {
        content: message,
      });
    }

    return this.pristineSend(channelID, message);
  }

  /**
   * Destroys all of the client connections.
   */
  public abstract destroy(): Promise<void>;

  protected abstract pristineSend(channelID: string, options: ChocoMessageOptions): Promise<ChocoMessage>;
}

export interface ChocoPlatform {
  emit(event: 'message', message: ChocoMessage): boolean;
  emit(event: 'ready'): boolean;

  on(event: 'message', listener: (message: ChocoMessage) => void): this;
  on(event: 'ready', listener: () => void): this;
}

export interface ChocoUser {
  /**
   * The ID of the bot.
   */
  id: string;

  /**
   * The username of the bot.
   */
  username: string;
}


export interface ChocoMessage {
  /**
   * The Author of the message.
   */
  author: ChocoUser;

  /**
   * The content of the message.
   */
  content: string;

  /**
   * Replies to the given message.
   * @param message - the message you wish to send.
   * @returns the new message
   */
  reply(message: (string|ChocoMessageOptions)): Promise<ChocoMessage>;
}

export interface ChocoMessageOptions {
  /**
   * The content
   */
  content?: string;

  embed?: {
    /**
     * The header.
     */
    title?: {
      content?: string;

      url?: string;
    };

    /**
     * The content
     */
    content?: string;

    /**
     * The hexadecimal flair color!
     */
    color?: string;

    /**
     * The key-value fields.
     */
    fields?: ChocoMessageOptionsField[];

    /**
     * The footer.
     */
    footer?: {
      content?: string;

      iconURL?: string;
    };
  }
}

export interface ChocoMessageOptionsField {
  /**
   * The field name.
   */
  name: string;

  /**
   * The field value.
   */
  value: string;

  /**
   * Whether the field should be displayed inline.
   */
  inline?: boolean;
}
