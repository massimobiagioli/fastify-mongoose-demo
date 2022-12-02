import { FastifyInstance } from 'fastify'
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import mongoose from 'mongoose'
import { Device, DeviceModel } from '../models/device'
import {settings} from "../config";

export interface DB {
  models: Models
}

export interface Models {
  Device: DeviceModel
}

const DBPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  try {
    mongoose.connection.on('connected', () => {
      fastify.log.info({ actor: 'MongoDB' }, 'connected')
    })
    mongoose.connection.on('disconnected', () => {
      fastify.log.error({ actor: 'MongoDB' }, 'disconnected')
    })

    const db = await mongoose.connect(settings.mongoUri)

    const models: Models = { Device }

    fastify.decorate('db', { models }).addHook('onClose', () => {
      db.connection.close()
    })
  } catch (error) {
    console.error(error)
  }
}

export default fp(DBPlugin)
