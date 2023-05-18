import { prisma } from '../lib/dbClient';

export const getMonthlyContribution = async () =>
  prisma.$queryRaw<{ month: string; totalNumberOfCommits: number }[]>`
    SELECT 
      date_trunc('month', to_timestamp("weekStartDateTs")) AS month,
      SUM("numberOfCommits") AS "totalNumberOfCommits"
    FROM 
      "WeeklyContribution"
    GROUP BY
      month
    ORDER BY
      month DESC
    LIMIT
      12;
  `;
