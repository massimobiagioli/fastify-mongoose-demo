import { UserModel } from '../models'

const createUserService = (User: UserModel) => {
  return {
    getByUsername: async (username: string) => {
      return User.findOne({ username })
    },
  }
}

export default createUserService
