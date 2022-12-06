import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'
import { DeviceModel } from '../models'

export type CreateDevice = {
  name: string
  address: string
}

export type UpdateDeviceData = {
  name: string
  address: string
}

export type UpdateDevice = {
  id: string
  data: UpdateDeviceData
}

export const createDeviceService = (Device: DeviceModel) => {
  return {
    findAll: async () => {
      return Device.find({})
    },
    getById: async (id: string) => {
      return Device.findById(id)
    },
    create: async (data: CreateDevice) => {
      const device = Device.addOne(data)
      await device.save()
      return device
    },
    update: async ({ id, data }: UpdateDevice) => {
      return Device.findByIdAndUpdate(id, data, { new: true })
    },
    activate: async (id: string) => {
      return Device.findByIdAndUpdate(id, { isActive: true }, { new: true })
    },
    deactivate: async (id: string) => {
      return Device.findByIdAndUpdate(id, { isActive: false }, { new: true })
    },
    remove: async (id: string) => {
      return Device.findByIdAndDelete(id)
    },
  }
}

const DevicePlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { Device } = instance.db.models
  instance.decorate('Device', createDeviceService(Device))
}

export default fp(DevicePlugin, {
  name: 'device-plugin',
})