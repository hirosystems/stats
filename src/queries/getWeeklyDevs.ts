import { prisma } from '../lib/dbClient';

export const getWeeklyDevs = async (minimumCommits: number) =>
  prisma.$queryRaw<
    {
      weekStartDateTs: number;
      numberOfContributors: number;
    }[]
  >`
    SELECT
        "weekStartDateTs",
        COUNT(DISTINCT  wc."contributorId") AS "numberOfContributors"
    FROM
        "WeeklyContribution" AS wc 
    JOIN
        "RepositoryContributor" AS rc ON wc."repositoryId" = rc."repositoryId" AND wc."contributorId" = rc."contributorId" 
    JOIN
        "Contributor" AS c ON rc."contributorId" = c.id
    WHERE
        wc."numberOfCommits" >= ${minimumCommits} AND
        c."type" = 'User'
    GROUP BY
        wc."weekStartDateTs"
    ORDER BY
        wc."weekStartDateTs" DESC
    LIMIT 20
  `;
