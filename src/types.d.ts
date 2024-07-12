import {
    SlashCommandBuilder,
    CommandInteraction,
    Collection,
    PermissionResolvable,
    Message,
    AutocompleteInteraction,
  } from "discord.js";
  
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
    
  export type GuildOption = keyof GuildOptions;
  export interface BotEvent {
    name: string;
    enable: boolean;
    once?: boolean | false;
    execute: (...args) => void;
  }
    
  declare module "discord.js" {
    export interface Client {
      slashCommands: Collection<string, SlashCommand>;
      commands: Collection<string, Command>;
      cooldowns: Collection<string, number>;
    }
  }