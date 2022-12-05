import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'
import { DeviceAttrs } from '../models'
import createDeviceService from '../services/deviceService'

interface deviceParams {
  id: string
}

const DevicePlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  instance.register(async (instance) => {
    const { Device } = instance.db.models
    instance.decorate('Device', createDeviceService(Device))
    instance.register(DeviceRoutesPlugin)
  })
}

const DeviceRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { Device } = instance

  instance.get('/api/devices', {}, async (request, reply) => {
    try {
      const devices = await Device.findAll()
      return reply.code(200).send(devices)
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send()
    }
  })

  instance.get<{ Params: deviceParams }>(
    '/api/devices/:id',
    {},
    async (request, reply) => {
      try {
        const device = await Device.getById(request.params.id)
        if (!device) {
          return reply.code(404).send()
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )

  instance.post<{ Body: DeviceAttrs }>(
    '/api/devices',
    {},
    async (request, reply) => {
      try {
        const device = await Device.create(request.body)
        return reply.code(201).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )

  instance.put<{ Params: deviceParams; Body: DeviceAttrs }>(
    '/api/devices/:id',
    {},
    async (request, reply) => {
      try {
        const id = request.params.id
        const device = await Device.update({ id, data: request.body })
        if (!device) {
          return reply.code(404).send()
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )

  instance.delete<{ Params: deviceParams }>(
    '/api/devices/:id',
    {},
    async (request, reply) => {
      try {
        const device = await Device.remove(request.params.id)
        if (!device) {
          return reply.code(404).send()
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )

  instance.patch<{ Params: deviceParams }>(
    '/api/devices/:id/activate',
    {},
    async (request, reply) => {
      try {
        const device = await Device.activate(request.params.id)
        if (!device) {
          return reply.code(404).send()
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )

  instance.patch<{ Params: deviceParams }>(
    '/api/devices/:id/deactivate',
    {},
    async (request, reply) => {
      try {
        const device = await Device.deactivate(request.params.id)
        if (!device) {
          return reply.code(404).send()
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )
}

export default fp(DevicePlugin)
