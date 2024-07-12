import { readdirSync } from "fs";
import { join } from "path";
import { BotEvent } from "@/types";
import DiscordClient from "@/client/client";
import createLogger from "@/utils/logger";

class EventLoader {
  private client: DiscordClient;
  private eventsDir: string;
  private logger = createLogger('%c[EventLoader]', 'color: #a02d2a; font-weight: bold');

  constructor(client: DiscordClient) {
    this.client = client;
    this.eventsDir = join(__dirname, "../events");
    this.loadEvents();
  }

  private loadEvents(): void {
    readdirSync(this.eventsDir).forEach((file) => {
      if (!file.endsWith(".ts")) return;
      try {
        const EventClass = require(`${this.eventsDir}/${file}`).default;
        if (!EventClass) {
          throw new Error(`Module ${file} does not have a default export.`);
        }

        const event: BotEvent = new EventClass(this.client);

        this.logger.debug(`Imported event: ${event.name}`);
        this.logger.debug(`${event.name} event loaded with ${event.once ? "once" : "on"} listener ${event.enable ? "enabled" : "disabled"}`);

        if (!event.enable) return;

        if (event.once) {
          this.client.once(event.name, (...args) => event.execute(...args));
        } else {
          this.client.on(event.name, (...args) => event.execute(...args));
        }

        this.logger.log(`[🔧] Successfully loaded event ${event.name}`);
      } catch (error) {
        this.logger.error(`Failed to load event from file ${file}: ${error.message}`);
      }
    });
  }
}

export default EventLoader;
