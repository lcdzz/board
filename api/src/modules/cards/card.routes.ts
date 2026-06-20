import { FastifyInstance } from 'fastify';
import { CreateCardDto, MoveCardDto, UpdateCardDto } from './card.types';
import { cardService } from './card.service';
import { IdParams } from '@shared/types';

export function cardRoutes(fastify: FastifyInstance, opts: any, done: () => void) {
  fastify.get('/', async (request, reply) => {
    const cards = await cardService.findAll();
    reply.send(cards);
  });

  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    const card = await cardService.findById(request.params.id);
    reply.send(card);
  });

  fastify.post<{ Body: CreateCardDto }>('/', async (request, reply) => {
    const created = await cardService.create(request.body);
    reply.code(201).send(created);
  });

  fastify.put<{ Params: IdParams; Body: UpdateCardDto }>('/:id', async (request, reply) => {
    const updated = await cardService.update(request.params.id, request.body);
    reply.send(updated);
  });

  fastify.patch<{ Params: IdParams; Body: MoveCardDto }>('/:id/move', async (request, reply) => {
    const moved = await cardService.move(request.params.id, request.body);
    reply.send(moved);
  });

  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    await cardService.delete(request.params.id);
    reply.code(204).send();
  });

  done();
}
