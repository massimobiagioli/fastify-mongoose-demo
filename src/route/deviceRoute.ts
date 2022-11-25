import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'
import { DB } from '../model'
import { DeviceAttrs } from '../model/device'
import createDeviceAction from "../actions/createDeviceAction";
import listDevicesAction from "../actions/listDevicesAction";
import getDeviceAction from "../actions/getDeviceAction";

declare module 'fastify' {
  export interface FastifyInstance {
    db: DB
  }
}

interface deviceParams {
  id: string
}

const DeviceRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  _options: FastifyPluginOptions,
) => {
  server.get('/api/devices', {}, async (request, reply) => {
    try {
      const action = listDevicesAction(server.db);
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
          const device = await action(id)
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

}

export default fp(DeviceRoute)
