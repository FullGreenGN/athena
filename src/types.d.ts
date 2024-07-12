import {
  SlashCommandBuilder,
  CommandInteraction,
  Collection,
  PermissionResolvable,
  Message,
  AutocompleteInteraction,
} from "discord.js";
import mongoose from "mongoose";

export interface SlashCommand {
  enable: boolean;
  command: SlashCommandBuilder | any;
  execute: (interaction: CommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  cooldown?: number; // in seconds
  botPermissions: Array<PermissionResolvable>;
}

export interface Command {
  name: string;
  enable: boolean;
  execute: (message: Message, args: Array<string>) => void;
  permissions: Array<PermissionResolvable>;
  botPermissions: Array<PermissionResolvable>;
  aliases: Array<string>;
  cooldown?: number;
}

interface GuildOptions {
  prefix: string;
}

export interface IGuild extends mongoose.Document {
  guildID: string;
  options: GuildOptions;
  joinedAt: Date;
}

export type GuildOption = keyof GuildOptions;

export interface BotEvent {
  name: string;
  once: boolean;
  enable: boolean;
  execute(...args: any[]): void;
}