import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'

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

export default fp(UserRoutesPlugin, {
  name: 'user-routes-plugin',
  dependencies: ['user-plugin'],
})
