import { prisma } from '../../lib/dbClient';
import { logger } from '../../lib/logger';

export async function updateRepos(ecosystem: string, repos: string[]) {
  logger.info('Updating repos...');
  const reposData = repos
    .reduce((acc, repo) => {
      const repoUrlWithoutTrailingSlash = repo.endsWith('/') ? repo.slice(0, -1) : repo;
      const repoUrlParts = repoUrlWithoutTrailingSlash.split('/');
      const repoName = repoUrlParts.pop();
      const repoOwner = repoUrlParts.pop();
      if (repoName && repoOwner) acc.push({ name: `${repoOwner}/${repoName}` });
      return acc;
    }, [] as { name: string }[])
    .filter(org => org.name !== undefined);
  const dbUpserts = [];
  for (const repo of reposData) {
    dbUpserts.push(
      prisma.repository.upsert({
        where: { name: repo.name },
        create: { ...repo, ecosystem },
        update: { ...repo, ecosystem },
      })
    );
  }
  await prisma.$transaction(dbUpserts);

  logger.info(`Updated ${reposData.length} repos!`);
}
