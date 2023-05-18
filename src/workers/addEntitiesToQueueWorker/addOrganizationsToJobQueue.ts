import { logger } from '../../lib/logger';
import { prisma } from '../../lib/dbClient';
import { queueManager, QUEUES } from '../../lib/queues';

const pageSize = 10;

export const addOrganizationsToJobQueue = async () => {
  try {
    logger.info('Adding organizations to job queue...');
    let organizationsPage = await prisma.owner.findMany({
      take: pageSize,
      where: { type: 'Organization' },
    });
    while (organizationsPage.length > 0) {
      organizationsPage.forEach(organization => {
        void queueManager.send(QUEUES.ORGANIZATIONS, organization, {
          retryLimit: 3,
          retryDelay: 1,
          singletonKey: organization.name,
          onComplete: true,
        });
      });
      organizationsPage = await prisma.owner.findMany({
        take: pageSize,
        skip: 1, // skip the cursor
        cursor: {
          id: organizationsPage[organizationsPage.length - 1].id,
        },
        where: {
          type: 'Organization',
        },
      });
    }
    logger.info('Done adding organizations to job queue');
  } catch (error) {
    console.log('Error running updateOrganizationReposJob job', error);
  }
};
