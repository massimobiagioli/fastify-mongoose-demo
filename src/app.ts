import { fastify, FastifyReply, FastifyRequest } from 'fastify'
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

  app.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        request.jwtVerify(async (err, decoded) => {
          if (err) {
            reply.code(401).send({ error: 'Unauthorized' })
          }

          // const user = await User.getByUsername(decoded.userId)
          // if (!user) {
          //     reply.code(401).send({error: 'Unauthorized'})
          // }
          //
          // request.user = {
          //     username: user?.username ?? '',
          //     firstname: user?.firstname ?? '',
          //     lastname: user?.lastname ?? '',
          //     email: user?.email ?? '',
          // }

          request.user = {
            username: 'guest',
            firstname: 'guest firstname',
            lastname: 'guest lastname',
            email: 'guest email',
          }
        })
      } catch (err) {
        reply.send(err)
      }
    },
  )

  return app
}

export default createApp
