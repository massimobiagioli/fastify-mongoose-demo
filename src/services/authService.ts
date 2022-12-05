import { FastifyReply, FastifyRequest } from 'fastify'

export const verifyToken = async function (
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    request.jwtVerify((err, decoded) => {
      if (err) {
        reply.code(401).send({ error: 'Unauthorized' })
      }
      request.user = {
        id: decoded.userId,
        name: 'Pippo',
        email: 'pippo@email.com',
      }
    })
  } catch (err) {
    reply.send(err)
  }
}
