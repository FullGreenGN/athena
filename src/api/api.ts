import { API } from "42-connector";
import ConfigManager from "@/config/config";
import { Coaltion } from "@/types/api.types";
import createLogger from "@/utils/logger";

export class Api {
    logger: ReturnType<typeof createLogger>;
    config: ConfigManager;
    private apiURL: string;
    private accessToken: string;
    private api: API;

    constructor() {
        this.logger = createLogger('%c[Api]', 'color: #a02d2a;');
        this.logger.log('API 42 initialized');
        this.config = new ConfigManager();
        this.apiURL = this.config.getConfig().api.url;
        this.accessToken = '';
        this.api = new API(this.config.getConfig().api.uid, this.config.getConfig().api.secret);
    }

    async getCoalitions(): Promise<Response> {
        try {
            await this.api.get('/v2/coalitions').then((res: any) => {
                return res.data;
            });

            return null;
        } catch (error) {
            this.logger.error(`Failed to get coalitions: ${error}`);
            return null;
        }
    }

    async getUserCoalition(id: string): Promise<Coaltion[]> {
        try {
            const response = await this.api.get(`/v2/users/${id}/coalitions`);
            const data = response.json as Coaltion[];
    
            return data;
            
        } catch (error) {
            this.logger.error(`Failed to get user: ${error}`);
            return null;
        }
    }
}
