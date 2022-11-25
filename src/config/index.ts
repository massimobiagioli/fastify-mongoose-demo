import * as dotenv from 'dotenv'

dotenv.config()

const DEFAULT_SERVER_PORT = 3000

export interface Settings {
  serverPort: number
  mongoUri: string
}

export const settings: Settings = {
  serverPort: process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : DEFAULT_SERVER_PORT,

  mongoUri: process.env.MONGO_URI || '',
}