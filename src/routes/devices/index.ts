import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import { DeviceAttrs } from '../../models'

interface deviceParams {
  id: string
}

const DeviceRoutesPlugin: FastifyPluginAsync = async (
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  const { Device } = instance

  instance.get(
    '/',
    {
      onRequest: [instance.authenticate],
    },
    async (request, reply) => {
      try {
        const devices = await Device.findAll()
        return reply.code(200).send(devices)
      } catch (error) {
        request.log.error(error)
        return reply.code(500).send()
      }
    },
  )

  instance.get<{ Params: deviceParams }>(
    '/:id',
    {
      onRequest: [instance.authenticate],
    },
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
    '/',
    {
      onRequest: [instance.authenticate],
    },
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
    '/:id',
    {
      onRequest: [instance.authenticate],
    },
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
    '/:id',
    {
      onRequest: [instance.authenticate],
    },
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
    '/:id/activate',
    {
      onRequest: [instance.authenticate],
    },
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
    '/:id/deactivate',
    {
      onRequest: [instance.authenticate],
    },
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

export default DeviceRoutesPlugin
