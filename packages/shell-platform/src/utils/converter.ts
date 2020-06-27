import chalk from 'chalk';

import { ChocoMessageOptions } from '@team-choco/core';

/**
 * Converts the complex ChocoMessageOptions to a basic string.
 *
 * @param options - the options to convert.
 * @returns the converted options.
 */
export function convertChocoMessageOptionsToContent(options: ChocoMessageOptions): string {
  const content: (string|any[]) = [];

  if (options.content) content.push(options.content);

  if (options.embed) {
    const embed: (string|string[])[] = [];

    const color = options.embed.color ? chalk.hex(options.embed.color) : (text: string) => text;

    content.push(chalk.bold('Embed'));

    if (options.embed.title && options.embed.title.content) {
      embed.push(chalk.italic(color(options.embed.title.content)));
    }

    if (options.embed.content) {
      embed.push(color(options.embed.content));
    }

    if (options.embed.fields) {
      embed.push(chalk.bold(color('Fields')));
      embed.push(options.embed.fields.map((field) => color(`> ${field.name}: ${field.value}`)));
    }

    if (options.embed.footer && options.embed.footer.content) {
      embed.push(color(options.embed.footer.content));
    }

    content.push(embed);
  }

  return contentToString(content);
}

function contentToString(content: (string|any[])[], indent = 0): string {
  return content.reduce((output: string, value, i) => {
    const newLine = i === 0 ? '' : '\n\n';
    if (Array.isArray(value)) {
      return output + `${newLine}${contentToString(value, indent + 2)}`;
    }

    return output + `${newLine}${' '.repeat(indent)}${value}`;
  }, '');
}
