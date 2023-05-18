import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/dbClient';
import { logger } from '../../lib/logger';

export const getEcosystems = async (): Promise<
  { ecosystem: string; repositoryCount: number }[]
> => {
  try {
    const ecosystems = await prisma.repository.groupBy({
      by: ['ecosystem'],
      _count: {
        _all: true,
      },
    });
    return ecosystems.map(({ ecosystem, _count }) => ({
      ecosystem,
      repositoryCount: _count._all,
    }));
  } catch (e) {
    logger.error(e);
    return [];
  }
};

export const getEcosystemsEndpoint = (server: FastifyInstance) => {
  server.get<{
    Params: { ecosystem: string; type?: 'full-time' | 'part-time' };
    Querystring: { windowSize?: number };
  }>('/ecosystems', async request => {
    return await getEcosystems();
  });
};
