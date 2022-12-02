import { fastify } from 'fastify'
import pino from 'pino'
import autoload from '@fastify/autoload'
import path from 'path'

const createApp = () => {
  const app = fastify({
    logger: pino({ level: 'info' }),
  })

  app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
  })

  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
  })

  return app
}

export default createApp
