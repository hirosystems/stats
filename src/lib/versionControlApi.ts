import { Octokit as OctokitBase } from 'octokit';
import { throttling } from '@octokit/plugin-throttling';
import { logger } from './logger';
import { queueManager, QUEUES } from './queues';
import { Repository } from '@prisma/client';

const Octokit = OctokitBase.plugin(throttling);

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    enabled: true,
    onRateLimit: (
      retryAfter: number,
      options: { method: string; url: string },
      octokit: OctokitBase,
      retryCount: number
    ) => {
      logger.info(
        `Request quota exhausted for request ${options.method} ${options.url}. Retrying after ${retryAfter} seconds!`
      );
      return true;
    },
    onSecondaryRateLimit: (
      retryAfter: number,
      options: { method: string; url: string },
      octokit: OctokitBase
    ) => {
      logger.info(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}. Retrying after ${retryAfter} seconds!`,
        retryAfter,
        options
      );
      return true;
    },
  },
});

export interface Repo {
  full_name: string;
}

export const getOrgRepos = async (orgName: string): Promise<Repo[]> => {
  const { data } = await octokit.rest.repos.listForOrg({
    org: orgName,
    type: 'public',
  });
  return data;
};

export interface WeeklyContribution {
  total: number;
  weeks: { w?: number; a?: number; d?: number; c?: number }[];
  author: { login: string; type: string };
}

export const getRepoContributionStats = async (
  jobId: string,
  repository: Repository,
  retryWaitTimeFor202StatusMs: number,
  trial = 1
): Promise<{
  status: number;
  data: WeeklyContribution[];
}> => {
  const [owner, repo] = repository.name.split('/');
  const contributors = await octokit.rest.repos.getContributorsStats({ owner, repo });
  if (contributors.status === 202) {
    logger.info(
      `Status: 202 (${repository.name}), retrying after ${
        (retryWaitTimeFor202StatusMs * trial) / 1000
      } seconds...`
    );
    await queueManager.complete(jobId);
    const newJobId = await queueManager.send(QUEUES.REPOSITORIES, repository, {
      retryLimit: 3,
      retryDelay: 1,
      singletonKey: repository.name,
    });
    console.log('requeue', newJobId);
    return {
      status: contributors.status,
      data: [],
    };
    // await new Promise(resolve => setTimeout(resolve, retryWaitTimeFor202StatusMs * trial));
    // return getRepoContributionStats(repoFullName, retryWaitTimeFor202StatusMs, trial);
  }
  logger.info(
    `Fetched stats for (${repository.name}) successfully! ${contributors?.data?.[0]?.author?.login}`
  );
  return {
    status: contributors.status,
    data: (contributors.data || []).flatMap(weeklyContribution =>
      weeklyContribution.author !== null
        ? [{ ...weeklyContribution, author: weeklyContribution.author }]
        : []
    ),
  };
};
