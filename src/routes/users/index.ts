import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import { UserDto } from '../../plugins/user'

const UserRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { User } = instance

  instance.get<{ Reply: UserDto }>(
    '/me',
    {
      onRequest: [instance.authenticate],
      schema: {
        tags: ['Users'],
        response: {
          200: UserDto,
          404: {
            type: 'null',
            description: 'User not found',
          },
          500: {
            type: 'null',
            description: 'Error retrieving user',
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const user = await User.getByUsername(request.user.username)
        if (!user) {
          return reply.code(404).send()
        }
        return user
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )
}

export default UserRoutesPlugin
