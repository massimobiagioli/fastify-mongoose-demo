import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import { CreateUserDto } from '../../plugins/user'

const LoginDto = Type.Object({
  username: Type.String(),
  password: Type.String(),
})
type LoginDto = Static<typeof LoginDto>

const Token = Type.Object(
  {
    token: Type.String(),
  },
  { description: 'JWT token' },
)
type Token = Static<typeof Token>

export const AuthRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { User } = instance

  instance.post<{ Body: CreateUserDto }>(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        body: CreateUserDto,
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
        reply.code(500).send()
      }
    },
  )

  instance.post<{ Body: LoginDto; Reply: Token }>(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: LoginDto,
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
        reply.code(500).send()
      }
    },
  )
}

export default AuthRoutesPlugin
