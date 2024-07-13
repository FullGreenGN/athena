import DiscordClient from '@/client/client';
import { PlayerEvents } from 'discord-player';
import fs from 'fs';
import path from 'path';

class PlayerEventHandler {
    private client: DiscordClient;
    private eventsDir: string;

    constructor(client: DiscordClient) {
        this.client = client;
        this.eventsDir = path.join(__dirname, '../player');
        this.loadEvents();
    }

    private loadEvents(): void {
        fs.readdir(this.eventsDir, (err, files) => {
            if (err) {
                console.error(`Error reading events directory: ${err.message}`);
                return;
            }

            files.forEach(file => {
                const eventPath = path.join(this.eventsDir, file);
                let eventModule;

                try {
                    eventModule = require(eventPath);
                } catch (error) {
                    console.error(`Failed to require event file ${file}: ${error.message}`);
                    return;
                }

                const event = eventModule.default || eventModule;

                if (typeof event !== 'function') {
                    console.error(`Event file ${file} does not export a function.`);
                    return;
                }

                const eventName = path.basename(file, path.extname(file)) as keyof PlayerEvents;
                console.log(`Loading player event: ${eventName}`);
                this.client.player.on(eventName, event.bind(null, this.client));
            });
        });
    }
}

export default PlayerEventHandler;
