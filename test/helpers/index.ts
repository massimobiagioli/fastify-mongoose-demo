import {fastify, FastifyInstance, FastifyPluginAsync} from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'
import JWT from '@fastify/jwt'
import { settings } from '../../src/config'

export type CreateTestAppOptions = {
  autoLoadPlugins?: boolean
  autoLoadRoutes?: boolean
  decorates?: Record<string, unknown>
  routes?: FastifyPluginAsync[]
}

const defaultCreateTestAppOptions: CreateTestAppOptions = {
  autoLoadPlugins: true,
  autoLoadRoutes: true,
  decorates: {},
  routes: [],
}

export const createTestApp = (
  createTestAppOptions: CreateTestAppOptions = defaultCreateTestAppOptions,
) => {
  const app = fastify()

  app.register(JWT, {
    secret: settings.jwtSecret,
  })

  const options = {
    ...defaultCreateTestAppOptions,
    ...createTestAppOptions,
  }

  if (options?.autoLoadPlugins) {
    app.register(autoload, {
      dir: path.join(__dirname, '../../src/plugins'),
    })
  }

  if (options?.decorates) {
    Object.entries(options.decorates).forEach(([key, value]) => {
      app.decorate(key, value)
    })
  }

  if (options?.autoLoadRoutes) {
    app.register(autoload, {
      dir: path.join(__dirname, '../../src/routes'),
      options: { prefix: '/api' },
    })
  } else {
    options?.routes?.forEach((route) => {
      app.register(route)
    })
  }

  return app
}

export const login = async (app: FastifyInstance) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      username: 'tester',
      password: 'Secret!'
    }
  })

  const loginInfo = response.json()

  return loginInfo.token
}
