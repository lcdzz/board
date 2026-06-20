import app from './app';
import prisma from './plugins/db';

const start = async () => {
  try {
    await prisma.$connect();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Server listening on ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
