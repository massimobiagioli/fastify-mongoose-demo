import { fastify, FastifyReply, FastifyRequest } from 'fastify'
import pino from 'pino'
import autoload from '@fastify/autoload'
import path from 'path'
import JWT from '@fastify/jwt'
import { settings } from './config'
import { verifyToken } from './services/authService'

const createApp = () => {
  const app = fastify({
    logger: pino({ level: 'info' }),
  })

  app.register(JWT, {
    secret: settings.jwtSecret,
  })

  app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
  })

  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
  })

  app.decorate('authenticate', verifyToken)

  return app
}

export default createApp
