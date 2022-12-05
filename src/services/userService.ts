import { UserModel } from '../models'

export type CreateUser = {
  username: string
  firstname: string
  lastname: string
  email: string
}

const createUserService = (User: UserModel) => {
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

export default createUserService
