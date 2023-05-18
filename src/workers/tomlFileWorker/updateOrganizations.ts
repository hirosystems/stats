import { prisma } from '../../lib/dbClient';
import { logger } from '../../lib/logger';

export async function updateOrganizations(ecosystem: string, organizations: string[]) {
  logger.info('Updating organizations...');
  const orgsData = organizations
    .reduce((acc, org) => {
      const name = org.split('/').pop();
      if (!!name) acc.push({ name, type: 'Organization' });
      return acc;
    }, [] as { name: string; type: string }[])
    .filter(org => org.name !== undefined);

  const dbUpserts = [];
  for (const org of orgsData) {
    dbUpserts.push(
      prisma.owner.upsert({
        where: { name: org.name },
        create: { ...org, ecosystem },
        update: { ...org, ecosystem },
      })
    );
  }
  await prisma.$transaction(dbUpserts);

  logger.info(`Updated ${orgsData.length} organizations!`);
}
