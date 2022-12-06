import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'

export type LoginAttrs = {
  username: string
  password: string
}

export type RegisterAttrs = {
  username: string
  password: string
  firstname: string
  lastname: string
  email: string
}

export const AuthRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { User } = instance

  instance.post<{ Body: RegisterAttrs }>(
    '/register',
    {},
    async (request, reply) => {
      try {
        await User.create(request.body)
        reply.code(201).send()
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )

  instance.post<{ Body: LoginAttrs }>('/login', {}, async (request, reply) => {
    try {
      const { username, password } = request.body
      if (!(await User.checkPassword(username, password))) {
        return reply.code(401).send()
      }
      const token = instance.jwt.sign({ username })
      reply.send({ token })
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send()
    }
  })
}

export default AuthRoutesPlugin
