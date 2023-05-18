import { prisma } from '../lib/dbClient';

export const getWeeklyContribution = async () =>
  await prisma.$queryRaw<
    {
      weekStartDateTs: number;
      totalCommits: number;
    }[]
  >`
    SELECT
    "weekStartDateTs" as "weekStartDateTs",
        SUM("numberOfCommits") AS "totalCommits"
    FROM
    "WeeklyContribution"
    GROUP BY
    "weekStartDateTs"
    ORDER BY
    "weekStartDateTs" DESC;
`;
