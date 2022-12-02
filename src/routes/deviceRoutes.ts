import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'
import { DB } from '../plugins/db'
import { DeviceAttrs } from '../models/device'
import createDeviceAction from '../action/createDeviceAction'
import listDevicesAction from '../action/listDevicesAction'
import getDeviceAction from '../action/getDeviceAction'
import updateDeviceAction from '../action/updateDeviceAction'
import deleteDeviceAction from '../action/deleteDeviceAction'
import changeDeviceActivationStatusAction from '../action/changeDeviceActivationStatusAction'

declare module 'fastify' {
  export interface FastifyInstance {
    db: DB
  }
}

interface deviceParams {
  id: string
}

const DeviceRoutesPlugin: FastifyPluginAsync = async (
  server: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  server.get('/api/devices', {}, async (request, reply) => {
    try {
      const action = listDevicesAction(server.db)
      const devices = await action()
      return reply.code(200).send(devices)
    } catch (error) {
      request.log.error(error)
      return reply.send(500)
    }
  })

  server.get<{ Params: deviceParams }>(
    '/api/devices/:id',
    {},
    async (request, reply) => {
      try {
        const id = request.params.id
        const action = getDeviceAction(server.db)
        const device = await action({ id })
        if (!device) {
          return reply.send(404)
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.send(400)
      }
    },
  )

  server.post<{ Body: DeviceAttrs }>(
    '/api/devices',
    {},
    async (request, reply) => {
      try {
        const action = createDeviceAction(server.db)
        const device = await action(request.body)
        return reply.code(201).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.send(500)
      }
    },
  )

  server.put<{ Params: deviceParams; Body: DeviceAttrs }>(
    '/api/devices/:id',
    {},
    async (request, reply) => {
      try {
        const id = request.params.id
        const action = updateDeviceAction(server.db)
        const device = await action({ id, data: request.body })
        if (!device) {
          return reply.send(404)
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.send(500)
      }
    },
  )

  server.delete<{ Params: deviceParams }>(
    '/api/devices/:id',
    {},
    async (request, reply) => {
      try {
        const id = request.params.id
        const action = deleteDeviceAction(server.db)
        const device = await action({ id })
        if (!device) {
          return reply.send(404)
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.send(500)
      }
    },
  )

  server.patch<{ Params: deviceParams }>(
    '/api/devices/:id/activate',
    {},
    async (request, reply) => {
      try {
        const id = request.params.id
        const action = changeDeviceActivationStatusAction(server.db)
        const device = await action({ id, active: true })
        if (!device) {
          return reply.send(404)
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.send(500)
      }
    },
  )

  server.patch<{ Params: deviceParams }>(
    '/api/devices/:id/deactivate',
    {},
    async (request, reply) => {
      try {
        const id = request.params.id
        const action = changeDeviceActivationStatusAction(server.db)
        const device = await action({ id, active: false })
        if (!device) {
          return reply.send(404)
        }
        return reply.code(200).send(device)
      } catch (error) {
        request.log.error(error)
        return reply.send(500)
      }
    },
  )
}

export default fp(DeviceRoutesPlugin)
