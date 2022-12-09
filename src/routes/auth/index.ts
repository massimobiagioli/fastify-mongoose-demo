import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import { Static, Type } from '@sinclair/typebox'

const LoginAttrs = Type.Object({
  username: Type.String(),
  password: Type.String(),
})
type LoginAttrs = Static<typeof LoginAttrs>

const Token = Type.Object(
  {
    token: Type.String(),
  },
  { description: 'JWT token' },
)
type Token = Static<typeof Token>

const RegisterAttrs = Type.Object({
  username: Type.String(),
  password: Type.String(),
  firstname: Type.String(),
  lastname: Type.String(),
  email: Type.String(),
})
type RegisterAttrs = Static<typeof RegisterAttrs>

export const AuthRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { User } = instance

  instance.post<{ Body: RegisterAttrs }>(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        body: RegisterAttrs,
        response: {
          201: {
            type: 'null',
            description: 'User registration successful',
          },
          500: {
            type: 'null',
            description: 'Error registering user',
          },
        },
      },
    },
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

  instance.post<{ Body: LoginAttrs; Reply: Token }>(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: LoginAttrs,
        response: {
          200: Token,
          401: {
            type: 'null',
            description: 'Invalid username or password',
          },
          500: {
            type: 'null',
            description: 'Error logging in user',
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { username, password } = request.body
        if (!(await User.checkPassword(username, password))) {
          return reply.code(401).send()
        }
        const token = instance.jwt.sign({ username }, { expiresIn: '1h' })
        return { token }
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )
}

export default AuthRoutesPlugin
