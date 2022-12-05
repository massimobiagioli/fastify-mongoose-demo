// import {FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyReply, FastifyRequest} from 'fastify'
// import fp from "fastify-plugin";
//
// const AuthPlugin: FastifyPluginAsync = async (
//     instance: FastifyInstance,
//     _options: FastifyPluginOptions,
// ) => {
//     const { User, Device } = instance
//
//     instance.decorate('authenticate', (
//         request: FastifyRequest,
//         reply: FastifyReply,
//     ) => {
//       try {
//         request.jwtVerify(async (err, decoded) => {
//           if (err) {
//             reply.code(401).send({ error: 'Unauthorized' })
//           }
//
//           console.log("*****************")
//           console.log("decoded", decoded)
//           console.log("Device", Device)
//           console.log("User", User)
//           console.log("*****************")
//
//           const user = await User.getByUsername(decoded.userId)
//           if (!user) {
//             reply.code(401).send({ error: 'Unauthorized' })
//           }
//
//           request.user = {
//             username: user?.username ?? '',
//             firstname: user?.firstname ?? '',
//             lastname: user?.lastname ?? '',
//             email: user?.email ?? '',
//           }
//         })
//       } catch (err) {
//         reply.send(err)
//       }
//     }
//   )
// }
//
// export default fp(AuthPlugin)
