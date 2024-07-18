import { SlashCommandBuilder, CommandInteraction, PermissionsBitField, ColorResolvable, ChannelType } from "discord.js";
import { SlashCommand } from "@/types";
import DiscordClient from "@/client/client";

export default class SetupCommand implements SlashCommand {
    enable = true;
    command = new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the bot")
    cooldown = 10;
    botPermissions = [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks];

    async execute(interaction: CommandInteraction): Promise<void> {
        const client = interaction.client as DiscordClient;
        try {
           const coalition = client.config.getConfig().api.coalitions;
            await interaction.reply('Setup started!');
            for (const c of coalition) {
                if (interaction.guild.roles.cache.find(role => role.name === c.name)) {
                     await interaction.editReply({
                          content: `Role '${c.name}' already exists!`,
                     });
                } else {
                    await interaction.guild.roles.create({
                        name: c.name,
                        color: c.color as ColorResolvable,
                        permissions: [],
                        reason: "Setup Coalition role",
                        hoist: true,
                    });
                }
            }

            await interaction.editReply({
                content: "Setup complete!",
            });
        } catch (error) {
            console.error('Error executing coalition command:', error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true // Only visible to the user who used the command
            });
        }
    }
    
}
