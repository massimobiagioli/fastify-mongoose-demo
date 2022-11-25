import {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyPluginAsync
} from 'fastify';
import fp from 'fastify-plugin';
import { DB } from '../model';
import { DeviceAttrs } from '../model/device';

declare module 'fastify' {
    export interface FastifyInstance {
        db: DB;
    }
}

interface deviceParams {
    id: string;
}

const DeviceRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {

    server.get('/api/devices', {}, async (request, reply) => {
        try {
            const { Device } = server.db.models;
            const devices = await Device.find({});
            return reply.code(200).send(devices);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });

    server.post<{ Body: DeviceAttrs }>('/api/devices', {}, async (request, reply) => {
        try {
            const { Device } = server.db.models;
            const device = await Device.addOne(request.body);
            await device.save();
            return reply.code(201).send(device);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });

    server.get<{ Params: deviceParams }>('/api/devices/:id', {}, async (request, reply) => {
        try {
            const id = request.params.id;
            const { Device } = server.db.models;
            const device = await Device.findById(id);
            if (!device) {
                return reply.send(404);
            }
            return reply.code(200).send(device);
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    });
};

export default fp(DeviceRoute);
