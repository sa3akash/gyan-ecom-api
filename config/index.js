import dotenv from "dotenv"
dotenv.config()


export const {
    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    APP_URL
}= process.env;