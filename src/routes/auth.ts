import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string
    }
    user: {
      username: string
      firstname: string
      lastname: string
      email: string
    }
  }
}

export type LoginAttrs = {
  username: string
  password: string
}

export const AuthRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  instance.post<{ Body: LoginAttrs }>(
    '/api/auth/login',
    {},
    async (request, reply) => {
      try {
        const token = instance.jwt.sign({ userId: request.body.username })
        reply.send({ token })
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )
}

export default fp(AuthRoutesPlugin)