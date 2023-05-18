import QueueManager from 'pg-boss';
import { logger } from './logger';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export enum QUEUES {
  TOML_FILE = 'TOML_FILE',
  ADD_ENTITIES_TO_QUEUE = 'ADD_ENTITIES_TO_QUEUE',
  ORGANIZATIONS = 'ORGANIZATIONS',
  REPOSITORIES = 'REPOSITORIES',
}

console.log(process.env.DATABASE_URL);

export const queueManager = new QueueManager({
  connectionString: process.env.DATABASE_URL,
  application_name: 'stats',
  monitorStateIntervalSeconds: 60,
});

queueManager.on('stopped', () => logger.info('stopped'));
queueManager.on('error', error => logger.error(error));
// queueManager.on('monitor-states', payload => console.log('payload', payload));
