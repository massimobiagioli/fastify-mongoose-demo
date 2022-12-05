import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify'
import createUserService from '../services/userService'
import fp from 'fastify-plugin'

const UserPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { User } = instance.db.models
  instance.decorate('User', createUserService(User))
}

export default fp(UserPlugin, {
  name: 'user-plugin',
  dependencies: ['db-plugin'],
})
