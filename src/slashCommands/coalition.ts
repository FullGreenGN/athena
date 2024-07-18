import { SlashCommandBuilder, CommandInteraction, PermissionsBitField } from "discord.js";
import { SlashCommand } from "@/types";
import { Api } from "@/api/api";
import { Coaltion } from "@/types/api.types";

export default class UserCoalitionCommand implements SlashCommand {
    enable = true;
    command = new SlashCommandBuilder()
        .setName("coalition")
        .setDescription("Get your coalition's role")
        .addStringOption(option =>
            option.setName('login')
                .setDescription('your 42 login name to get your coalition')
                .setRequired(true)
        );
    cooldown = 10;
    botPermissions = [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks];

    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const api = new Api();

            const query = interaction.options.get('login')?.value as string;
            
            const response: Coaltion[] = await api.getUserCoalition(query);

            if(response[0] === null) {
                await interaction.reply({
                    content: `User '${query}' does not exist!`,
                    ephemeral: true
                });
                return;
            }

            const role = interaction.guild.roles.cache.find(role => role.name === response[response.length - 1].name);

            const member = interaction.guild.members.cache.get(interaction.user.id);
            
            if(member.roles.cache.find(role => role.name === response[0].name)) {
                await interaction.reply({
                    content: `You already have the '${response[0].name}' role!`,
                    ephemeral: true
                });
                return;
            }

            if(role) {
                for(const r of response) {
                    const coalitionRole = interaction.guild.roles.cache.find(role => role.name === r.name);
                    if(coalitionRole) {
                        await member.roles.add(coalitionRole);
                    }
                }
            }

            await interaction.reply({
                content: `You have been assigned to the '${response[0].name}' coalition!`,
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
