import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'

const UserRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { User } = instance

  instance.get(
    '/me',
    {
      onRequest: [instance.authenticate],
      schema: {
        tags: ['Users'],
        response: {
          200: {
            type: 'array',
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const user = await User.getByUsername(request.user.username)
        if (!user) {
          return reply.code(404).send({ message: 'User not found' })
        }
        return reply.code(200).send(user)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )
}

export default UserRoutesPlugin
