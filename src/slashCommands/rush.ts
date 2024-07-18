import { SlashCommandBuilder, CommandInteraction, PermissionsBitField, ColorResolvable, ChannelType } from "discord.js";
import { SlashCommand } from "@/types";
import DiscordClient from "@/client/client";

export default class UserCoalitionCommqnd implements SlashCommand {
    enable = true;
    command = new SlashCommandBuilder()
        .setName("rush")
        .setDescription("Create rush channels")
    cooldown = 10;
    botPermissions = [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks];

    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            
        } catch (error) {
            console.error('Error executing coalition command:', error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true // Only visible to the user who used the command
            });
        }
    }
    
}
