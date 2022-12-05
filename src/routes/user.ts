import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'
import createUserService from '../services/userService'

const UserPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  instance.register(async (instance) => {
    const { User } = instance.db.models
    instance.decorate('User', createUserService(User))
    instance.register(UserRoutesPlugin)
  })
}
const UserRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { User } = instance

  instance.get(
    '/api/users/me',
    {
      onRequest: [instance.authenticate],
    },
    async (request, reply) => {
      try {
        const user = await User.getByUsername(request.user.username)
        return reply.code(200).send(user)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )
}

export default fp(UserPlugin)
