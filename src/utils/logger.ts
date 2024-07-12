import ConfigManager from "@/config/config";

class LoggerUtil {

    prefix = '%c[Logger]';
    style = 'color: #a02d2a; font-weight: bold';

    constructor(prefix: string, style: string) {
        this.prefix = prefix;
        this.style = style;
    }

    log(p0: string) {
        console.log.apply(null, [this.prefix, this.style, ...p0]);
    }

    info(p0: string) {
        console.info.apply(null, [this.prefix, this.style, ...p0]);
    }
    
    warn(p0: string) {
        console.warn.apply(null, [this.prefix, this.style, ...p0]);
    }

    debug(p0: string) {
        if (new ConfigManager().get('debug')) {
            console.debug.apply(null, [this.prefix, this.style, ...p0]);
        }
    }

    error(p0: string) {
        console.error.apply(null, [this.prefix, this.style, ...p0]);
    }
}

export default function createLogger(prefix: string, style: string) {
    return new LoggerUtil(prefix, style);
}