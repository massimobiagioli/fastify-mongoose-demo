import { fastify } from 'fastify'
import pino from 'pino'

const createApp = () => {
  return fastify({
    logger: pino({ level: 'info' }),
  })
}

export default createApp
