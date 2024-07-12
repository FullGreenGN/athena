import ConfigManager from "@/config/config";
import createLogger from "../utils/logger";
import { Client, Collection, IntentsBitField, Partials, PresenceUpdateStatus } from "discord.js";
import { getType } from "@/utils/utils";
import path from "path";
import fs from "fs";

export default class DiscordClient extends Client {

    logger = createLogger("%c[Client]", "color: #a02d2a; font-weight: bold");
    commands: Collection<string, any>;
    slashCommands: Collection<string, any>;
    config: ConfigManager;

    constructor() {
        super({
            intents:[
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildVoiceStates
            ],
            partials: [Partials.User, Partials.Message, Partials.Reaction],
            allowedMentions: { repliedUser: false},
            presence: {
                activities: [
                    {
                        name: "with discord.js",
                        type: getType("COMPETING")
                    }
                ],
                status: PresenceUpdateStatus.DoNotDisturb,
            }
        });
        
        this.commands = new Collection()
        this.slashCommands = new Collection();
        this.config = new ConfigManager();
    }
    
    async start(token: string) {
        this.login(token).catch((error) => {
            this.logger.error("An error occurred while logging in: " + error);
        });

        const handlersDir = path.join(__dirname, "../handlers")

        fs.readdirSync(handlersDir).forEach((file) => {
            if (!file.endsWith(".ts")) return;
            const handler = require(path.join(handlersDir, file)).default;
            new handler(this);
        });

        return this
    }
}