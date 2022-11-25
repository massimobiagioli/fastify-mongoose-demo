import { fastify } from 'fastify'
import pino from 'pino'
import db from './model'
import deviceRoute from './route/device'
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
