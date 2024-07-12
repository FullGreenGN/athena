import { Client, Routes, SlashCommandBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command, SlashCommand } from '../types.d';
import DiscordClient from '@/client/client';
import createLogger from '@/utils/logger';

class CommandLoader {
  private client: DiscordClient;
  private slashCommands: SlashCommandBuilder[] = [];
  private commands: Command[] = [];
  private slashCommandsDir: string;
  private commandsDir: string;
  private logger = createLogger('%c[CommandLoader]', 'color: #a02d2a; font-weight: bold');

  constructor(client: DiscordClient) {
    this.client = client;
    this.slashCommandsDir = join(__dirname, '../slashCommands');
    this.commandsDir = join(__dirname, '../commands');

    this.loadSlashCommands();
    this.loadCommands();
    this.registerCommands();
  }

  private loadSlashCommands(): void {
    readdirSync(this.slashCommandsDir).forEach((file) => {
      if (!file.endsWith('.js')) return;
      const command: SlashCommand = require(`${this.slashCommandsDir}/${file}`).default;
      if (!command.enable) return;
      this.slashCommands.push(command.command);
      this.client.slashCommands.set(command.command.name, command);
    });
  }

  private loadCommands(): void {
    readdirSync(this.commandsDir).forEach((file) => {
      if (!file.endsWith('.js')) return;
      const command: Command = require(`${this.commandsDir}/${file}`).default;
      if (!command.enable) return;
      this.commands.push(command);
      this.client.commands.set(command.name, command);
    });
  }

  private registerCommands(): void {
    const rest = new REST({ version: '10' }).setToken(this.client.config.get('token'));

    rest
      .put(Routes.applicationCommands(process.env.CLIENT_ID!), {
        body: this.slashCommands.map((command) => command.toJSON()),
      })
      .then((data: any) => {
        this.logger.log(
            `[✅] Successfully Loaded ${this.slashCommands.length} SlashCommand(s)`
        );

        this.logger.log(
            `[✅] Successfully Loaded ${this.commands.length} Command(s)`
        );
      })
      .catch((e: any) => {
        this.logger.error(`[❌] Error: ${e}`);
      });
  }
}

export default CommandLoader;
