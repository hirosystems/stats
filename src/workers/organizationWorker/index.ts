import { Owner } from '@prisma/client';
import { logger } from '../../lib/logger';
import { getOrgRepos, Repo } from '../../lib/versionControlApi';
import { prisma } from '../../lib/dbClient';
import { WorkHandler } from 'pg-boss';
import { updateOrganizationRepoTransaction } from './updateOrganizationRepoTransaction';

export const organizationWorker: WorkHandler<Owner> = async ({ data: organization }) => {
  console.log('index', organization);
  try {
    const repos = await getOrgRepos(organization.name);
    await updateOrganizationRepoTransaction(repos, organization);
    logger.info(`Updated organization ${organization.name} repos successfully!`);
  } catch (error) {
    logger.error('Error updating organization repos', error);
  }
};
