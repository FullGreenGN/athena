import DiscordClient from './client/client'
import ConfigManager from './config/config'

new ConfigManager()

new DiscordClient().start(new ConfigManager().get('token'))