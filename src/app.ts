import { fastify } from 'fastify'
import pino from 'pino'
import autoload from '@fastify/autoload'
import path from 'path'
import JWT from '@fastify/jwt'
import { settings } from './config'
import { DB } from './plugins/db'
import createDeviceService from './services/deviceService'
import createUserService from './services/userService'

declare module 'fastify' {
  export interface FastifyInstance {
    db: DB
    User: ReturnType<typeof createUserService>
    Device: ReturnType<typeof createDeviceService>
    tester: string
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>
  }
}

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

  return app
}

export default createApp
