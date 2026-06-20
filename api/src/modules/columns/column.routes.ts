import { FastifyInstance } from 'fastify';
import { CreateColumnDto, MoveColumnDto, UpdateColumnDto } from './column.types';
import { columnService } from './column.service';
import { IdParams } from '@shared/types';

export function columnRoutes(fastify: FastifyInstance, opts: any, done: () => void) {
  fastify.get('/', async (request, reply) => {
    const columns = await columnService.findAll();
    reply.send(columns);
  });

  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    const column = await columnService.findById(request.params.id);
    reply.send(column);
  });

  fastify.post<{ Body: CreateColumnDto }>('/', async (request, reply) => {
    const created = await columnService.create(request.body);
    reply.code(201).send(created);
  });

  fastify.put<{ Params: IdParams; Body: UpdateColumnDto }>('/:id', async (request, reply) => {
    const updated = await columnService.update(request.params.id, request.body);
    reply.send(updated);
  });

  fastify.patch<{ Params: IdParams; Body: MoveColumnDto }>('/:id/move', async (request, reply) => {
    const moved = await columnService.move(request.params.id, request.body);
    reply.send(moved);
  });

  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    await columnService.delete(request.params.id);
    reply.code(204).send();
  });

  done();
}
