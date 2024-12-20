import { config as conf } from "dotenv";

conf()

const _config = {
    PORT: process.env.port,
    databaseUrl: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    env: process.env.env
}

export const config =  Object.freeze(_config)