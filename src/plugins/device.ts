import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from 'fastify'
import fp from 'fastify-plugin'
import createDeviceService from '../services/deviceService'

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
