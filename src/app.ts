import { fastify } from 'fastify'
import pino from 'pino'
import db from './model'

const createApp = () => {
  const app = fastify({
    logger: pino({ level: 'info' }),
  })

  app.register(db, { uri: 'mongodb://localhost:27017/device-manager' })

  return app
}

export default createApp
