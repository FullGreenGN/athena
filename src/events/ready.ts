import DiscordClient from "@/client/client";
import { BotEvent } from "../types";
import { Events } from "discord.js";

export default class ReadyEvent implements BotEvent {
    name = Events.ClientReady;
    once = true;
    enable = true;

    execute(client: DiscordClient) {
        client.logger.log(`[🟢] ${client.user.tag} is now online!`);
    }
}
