import dotenv from 'dotenv'

dotenv.config()

class Config {
    public port: string | number;
    public readonly nodeEnv: string;

    constructor() {
        this.port = process.env.PORT || 3000
        this.nodeEnv = process.env.NODE_ENV || 'development'
    }

    isProduction() {
        return this.nodeEnv === 'production'
    }
}
export const config = new Config()