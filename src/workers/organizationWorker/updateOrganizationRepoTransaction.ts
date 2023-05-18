import { Repo } from '../../lib/versionControlApi';
import { Owner } from '@prisma/client';
import { prisma } from '../../lib/dbClient';

export const updateOrganizationRepoTransaction = async (repos: Repo[], org: Owner) => {
  return await prisma.$transaction([
    ...repos.map(repo =>
      prisma.repository.upsert({
        where: { name: repo.full_name },
        create: {
          name: repo.full_name,
          owner: { connect: { id: org.id } },
        },
        update: {
          owner: { connect: { id: org.id } },
        },
      })
    ),
    prisma.owner.update({
      where: { id: org.id },
      data: { lastFetchedAt: new Date() },
    }),
  ]);
};
