import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'

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
        const payload = {
          username: 'guest',
        }
        const token = instance.jwt.sign({ payload })
        reply.send({ token })
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )
}

export default fp(AuthRoutesPlugin)
