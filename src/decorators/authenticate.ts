import { FastifyReply, FastifyRequest } from 'fastify'

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
}

export default authenticate
