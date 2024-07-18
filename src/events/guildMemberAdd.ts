import DiscordClient from "@/client/client";
import { BotEvent } from "../types";
import { EmbedBuilder, Events, GuildMember, Interaction } from "discord.js";
import { checkBotPermissions, getThemeColor } from "@/utils/utils";

export default class GuildMemberAdd implements BotEvent {
    name = Events.GuildMemberAdd;
    once = false;
    enable = true;

    execute(member: GuildMember) {
        const client = member.client as DiscordClient;

        try {
            const { guild } = member;
            const role = guild.roles.cache.find(role => role.id === client.config.getConfig().discord.guillMemberRoleId);

            if(role) {
                member.roles.add(role);
            }
        } catch (error) {
            client.logger.error('Error executing guildMemberAdd event: ' + error);
        }
    
    }
}
