import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { boardRoutes } from '@modules/boards';
import { AppError } from '@shared/errors';
import { cardRoutes } from '@modules/cards';
import { columnRoutes } from '@modules/columns';

const app = Fastify({ logger: true });

app.register(cors, { origin: true });
app.register(boardRoutes, { prefix: '/boards' });
app.register(cardRoutes, { prefix: '/cards' });
app.register(columnRoutes, { prefix: '/columns' });

app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({ error: error.message });
  }

  app.log.error(error);
  reply.code(500).send({ error: 'Internal server error' });
});

export default app;
