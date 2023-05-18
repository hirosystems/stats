import fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import { logger } from '../lib/logger';

export const init = () => {
  console.log('inittttt');
  const server = fastify({ logger: true });
  server
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .register(fastifyEnv, {
      schema: {
        type: 'object',
        required: ['GITHUB_TOKEN'],
        properties: {
          GITHUB_TOKEN: {
            type: 'string',
          },
        },
      },
      dotenv: true,
      data: process.env,
    })
    .ready(err => {
      if (err) {
        logger.error(err);
      }
    });
  return server;
};
