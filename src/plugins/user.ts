import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify'
import fp from 'fastify-plugin'
import { UserModel } from '../models'

export type CreateUser = {
  username: string
  firstname: string
  lastname: string
  email: string
}

export const createUserService = (User: UserModel) => {
  return {
    getByUsername: async (username: string) => {
      return User.findOne({ username })
    },
    create: async (data: CreateUser) => {
      const user = User.addOne(data)
      await user.save()
      return user
    },
  }
}

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