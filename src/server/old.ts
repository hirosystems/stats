import fastify from 'fastify';
import fastifyEnv from '@fastify/env';
// import { getWeeklyContribution } from './queries/getWeeklyContribution';
// import { getMonthlyContribution } from './queries/getMonthlyContribution';
// import { getWeeklyDevs } from './queries/getWeeklyDevs';
// import { getMonthlyDevs } from './queries/getMonthlyDevs';

function init() {
  const server = fastify({ logger: true });

  server
    // @ts-ignore
    .register(fastifyEnv, {
      schema: {
        type: 'object',
        required: ['GITHUB_TOKEN'],
        properties: {
          GITHUB_TOKEN: {
            type: 'string',
          },
        },
      },
      dotenv: true,
      data: process.env,
    })
    .ready(err => {
      if (err) {
        console.error(err);
      }
    });

  server.get<{ Params: { interval: 'weekly' | 'monthly' } }>(
    '/code/:interval',
    async (request, reply) => {
      const interval = request.params.interval;
      // if (interval === 'weekly') {
      //   return (await getWeeklyContribution()).map(week => ({
      //     weekStartDate: new Date(week.weekStartDateTs * 1000),
      //     numberOfCommits: Number(week._sum.numberOfCommits),
      //   }));
      // } else {
      //   return (await getMonthlyContribution()).map(monthlyContribution => ({
      //     month: monthlyContribution.month,
      //     numberOfCommits: Number(monthlyContribution.totalNumberOfCommits),
      //   }));
      // }
    }
  );

  server.get<{ Params: { interval: 'weekly' | 'monthly'; type?: 'full-time' | 'part-time' } }>(
    '/devs/:interval/:type?',
    async (request, reply) => {
      const interval = request.params.interval;
      const type = request.params.type;
      const minimumCommits = type === 'full-time' ? 10 : 1;
      // if (interval === 'weekly') {
      //   return (await getWeeklyDevs(minimumCommits)).map(week => ({
      //     numberOfContributors: Number(week.numberOfContributors),
      //     weekStartDate: new Date(week.weekStartDateTs * 1000),
      //   }));
      // } else {
      //   return (await getMonthlyDevs(minimumCommits)).map(month => ({
      //     numberOfContributors: Number(month.numberOfContributors),
      //     month: month.month,
      //   }));
      // }
    }
  );
  return server;
}

init().listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
});
