import { fastify, FastifyPluginAsync } from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'
import { DeviceRoutesPlugin } from '../routes/device'

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

  const options = {
    ...defaultCreateTestAppOptions,
    ...createTestAppOptions,
  }

  if (options?.autoLoadPlugins) {
    app.register(autoload, {
      dir: path.join(__dirname, '../plugins'),
    })
  }

  if (options?.decorates) {
    Object.entries(options.decorates).forEach(([key, value]) => {
      app.decorate(key, value)
    })
  }

  if (options?.autoLoadRoutes) {
    app.register(autoload, {
      dir: path.join(__dirname, '../routes'),
    })
  } else {
    options?.routes?.forEach((route) => {
      app.register(route)
    })
  }

  return app
}
