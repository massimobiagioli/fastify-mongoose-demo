import { FastifyInstance } from 'fastify'
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import mongoose from 'mongoose'
import { Device, DeviceModel } from '../models/device'
import { settings } from '../config'

export interface DB {
  models: Models
}

export interface Models {
  Device: DeviceModel
}

const DBPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  try {
    mongoose.connection.on('connected', () => {
      instance.log.info({ actor: 'MongoDB' }, 'connected')
    })
    mongoose.connection.on('disconnected', () => {
      instance.log.error({ actor: 'MongoDB' }, 'disconnected')
    })

    const db = await mongoose.connect(settings.mongoUri)

    const models: Models = { Device }

    instance.decorate('db', { models }).addHook('onClose', () => {
      db.connection.close()
    })
  } catch (error) {
    console.error(error)
  }
}

export default fp(DBPlugin)
