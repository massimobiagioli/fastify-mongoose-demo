import { fastify } from 'fastify'
import pino from 'pino'
import db from './db'
import deviceRoute from './route/deviceRoute'
import { settings } from './config'

const createApp = () => {
  const app = fastify({
    logger: pino({ level: 'info' }),
  })

  app.register(db, { uri: settings.mongoUri })
  app.register(deviceRoute)

  return app
}

export default createApp
