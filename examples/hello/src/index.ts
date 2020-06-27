import { ChocoBotCore } from '@team-choco/core';
import { PLATFORM } from '@team-choco/example-helpers';
import { ChocoCommandPlugin } from '@team-choco/command-plugin';

const bot = new ChocoBotCore({
  platform: PLATFORM,

  plugins: [
    new ChocoCommandPlugin({
      prefix: '!',
    }),
  ],
});

bot.command('hello', async ({ message }) => {
  await message.reply(`It's nice to meet you ${message.author.username}`);
});

bot.command('welcome <...name>', async ({ message, args }) => {
  await message.reply({
    embed: {
      title: {
        content: 'Hello World!',
      },
      color: '1ABC9C',
      fields: [{
        name: 'Hello',
        value: args.name,
      }],
    },
  });
});

bot.on('ready', () => {
  console.log('Kweh! Choco Bot is now up and running!');
});

process.on('SIGINT', async () => {
  await bot.destroy();
  process.exit(0);
});
