import { logger } from '../../lib/logger';
import { prisma } from '../../lib/dbClient';
import { queueManager, QUEUES } from '../../lib/queues';

const pageSize = 10;

export const addRepositoriesToJobQueue = async () => {
  try {
    logger.info('Adding repos to job queue...');
    let repositoriesPage = await prisma.repository.findMany({
      take: pageSize,
    });
    console.log('repositoriesPage.length', repositoriesPage.length);
    while (repositoriesPage.length > 0) {
      repositoriesPage.forEach(repository => {
        void queueManager.send(QUEUES.REPOSITORIES, repository, {
          retryLimit: 3,
          retryDelay: 1,
          singletonKey: repository.name,
        });
      });
      repositoriesPage = await prisma.repository.findMany({
        take: pageSize,
        skip: 1, // skip the cursor
        cursor: {
          id: repositoriesPage[repositoriesPage.length - 1].id,
        },
      });
    }
    logger.info('Done adding repos to job queue');
  } catch (error) {
    console.log('Error running updateOrganizationReposJob job', error);
  }
};
