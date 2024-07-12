import createLogger from '@/utils/logger';
import fs from 'fs';

export default class ConfigManager {

    logger = createLogger("%c[ConfigManager]", "color: #a02d2a; font-weight: bold");

    constructor() {
        if (!fs.existsSync('config.json')) {
            this.createConfig();
        }
    }

    createConfig() {
        fs.writeFileSync('config.json', JSON.stringify({
            "prefix": "%c[Logger]",
            "style": "color: #a02d2a; font-weight: bold",
            "token": "YOUR_BOT_TOKEN",
            "clientId": "YOUR_CLIENT_ID",
        }, null, 4));

        this.logger.log("Config file created");
    }

    getConfig() {
        return JSON.parse(fs.readFileSync('config.json').toString());
    }

    set(key: string, value: any) {
        const config = this.getConfig();
        config[key] = value;
        fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
    }

    get(key: string) {
        return this.getConfig()[key];
    }   

}