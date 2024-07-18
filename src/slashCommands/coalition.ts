import { SlashCommandBuilder, CommandInteraction, PermissionsBitField } from "discord.js";
import { SlashCommand } from "@/types";
import { Api } from "@/api/api";
import { Coaltion } from "@/types/api.types";

export default class UserCoalitionCommqnd implements SlashCommand {
    enable = true;
    command = new SlashCommandBuilder()
        .setName("coalition")
        .setDescription("Get your coalition's role")
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The coalition you want to get the role for')
                .setRequired(true)
        );
    cooldown = 10;
    botPermissions = [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks];

    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const api = new Api();

            const query = interaction.options.get('query')?.value as string;
            
            const response: Coaltion[] = await api.getUserCoalition(query);
            console.log(response);
    
            await interaction.reply({
                content: `Your coalition name is: ${response[0].name}`,
                ephemeral: true
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
