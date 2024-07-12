import DiscordClient from "@/client/client";
import { BotEvent } from "../types";
import { ChannelType, Message, EmbedBuilder, Events } from "discord.js";
import { checkBotPermissions, checkPermissions, getThemeColor, sendTimedMessage } from "@/utils/utils";

export default class MessageCreateEvent implements BotEvent {
    name = Events.MessageCreate;
    once = true;
    enable = true;

    execute(client: DiscordClient, message: Message) {
        try {
            console.log(message)
            if (!message.guild || !message.member || message.author.bot) return;

            let prefix = "!";

            // Check bot mention
            const mention = new RegExp(`^<@!?${client.user?.id}>( |)$`);
            if (message.content.match(mention)) {
                const embed = new EmbedBuilder()
                    .setColor(getThemeColor('mainColor'))
                    .setDescription(`Hey! My Prefix is: \`${prefix}\``);
                return message.reply({ embeds: [embed] });
            }

            if (!message.content.startsWith(prefix)) return;
            if (message.channel.type !== ChannelType.GuildText) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift()?.toLowerCase();
            if (!commandName) return;

            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return;

            // Check user cooldown
            const cooldownKey = `${command.name}-${message.author.id}`;
            const cooldownTime = client.cooldowns.get(cooldownKey);
            if (command.cooldown && cooldownTime && cooldownTime > Date.now()) {
                const timeLeft = Math.ceil((cooldownTime - Date.now()) / 1000);
                return sendTimedMessage(`You need to wait ${timeLeft} more second(s) before reusing the \`${command.name}\` command.`, message.channel, 5000);
            }

            // Check user permissions
            const missingPermissions = checkPermissions(message.member, command.permissions);
            if (missingPermissions.length > 0) {
                return sendTimedMessage(`❌ You are missing the following permissions to execute this command: ${missingPermissions.join(", ")}`, message.channel, 5000);
            }

            // Check bot permissions
            const missingBotPermissions = checkBotPermissions(message, command.botPermissions);
            if (missingBotPermissions.length > 0) {
                return sendTimedMessage(`❌ I am missing the following permissions to execute this command: ${missingBotPermissions.join(", ")}`, message.channel, 5000);
            }

            // Execute command
            try {
                command.execute(message, args);
            } catch (error) {
                console.error(`Error executing command ${command.name}:`, error);
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(getThemeColor('mainColor'))
                            .setDescription(`❌ Error executing the command: ${error.message}`)
                    ]
                });
            }

            // Set user cooldown
            if (command.cooldown) {
                client.cooldowns.set(cooldownKey, Date.now() + command.cooldown * 1000);
                setTimeout(() => client.cooldowns.delete(cooldownKey), command.cooldown * 1000);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }
}
