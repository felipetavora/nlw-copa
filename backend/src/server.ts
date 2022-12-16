import Fastify from 'fastify';
import cors from '@fastify/cors';
import { poolRoutes } from './routes/pool';
import { userRoutes } from './routes/user';
import { guessRoutes } from './routes/guess';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';
import fastifyJwt from '@fastify/jwt';

async function start() {
   const fastify = Fastify({
      logger: true,
   });

   try {
      await fastify.register(cors, {
         origin: true,
      });

      //in production needs to be a environment variable
      await fastify.register(fastifyJwt, {
         secret: 'nlwcopanlw',
      });
      await fastify.register(poolRoutes);
      await fastify.register(authRoutes);
      await fastify.register(gameRoutes);
      await fastify.register(guessRoutes);
      await fastify.register(userRoutes);
      await fastify.listen({ port: 4000, host: '0.0.0.0' });
   } catch (error) {
      fastify.log.error(error);
      process.exit();
   }
}

start();
