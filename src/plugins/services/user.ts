import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify'
import fp from 'fastify-plugin'
import { UserDocument, UserModel } from '../../models'
import { Static, Type } from '@sinclair/typebox'

export const UserDto = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String(),
  firstname: Type.String(),
  lastname: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
})
export type UserDto = Static<typeof UserDto>

export const CreateUserDto = Type.Object({
  username: Type.String(),
  password: Type.String(),
  firstname: Type.String(),
  lastname: Type.String(),
  email: Type.String(),
})
export type CreateUserDto = Static<typeof CreateUserDto>

export const createUserService = (User: UserModel) => {
  const serialize = (document: UserDocument): UserDto => {
    return {
      id: document._id,
      username: document.username,
      email: document.email,
      firstname: document.firstname,
      lastname: document.lastname,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    }
  }

  return {
    getByUsername: async (username: string): Promise<UserDto | undefined> => {
      const document = await User.findOne({ username })
      if (!document) {
        return undefined
      }
      return serialize(document)
    },
    create: async (data: CreateUserDto) => {
      const user = User.addOne(data)
      await user.save()
      return user
    },
    checkPassword: async (username: string, password: string) => {
      return User.verifyPassword(username, password)
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

export default fp(UserPlugin)
