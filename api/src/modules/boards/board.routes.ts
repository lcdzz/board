import { IdParams } from '@shared/types';
import { FastifyInstance } from 'fastify';

import { boardService } from './board.service';
import { CreateBoardDto, UpdateBoardDto } from './board.types';

export function boardRoutes(fastify: FastifyInstance, opts: any, done: () => void) {
  fastify.get('/', async (request, reply) => {
    const boards = await boardService.findAll();
    reply.send(boards);
  });

  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    const board = await boardService.findByIdWithDetails(request.params.id);
    reply.send(board);
  });

  fastify.post<{ Body: CreateBoardDto }>('/', async (request, reply) => {
    const created = await boardService.create(request.body);
    reply.code(201).send(created);
  });

  fastify.put<{ Params: IdParams; Body: UpdateBoardDto }>('/:id', async (request, reply) => {
    const updated = await boardService.update(request.params.id, request.body);
    reply.send(updated);
  });

  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    await boardService.delete(request.params.id);
    reply.code(204).send();
  });

  done();
}
