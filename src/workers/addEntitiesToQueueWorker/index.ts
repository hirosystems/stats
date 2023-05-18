import { addOrganizationsToJobQueue } from './addOrganizationsToJobQueue';
import { addRepositoriesToJobQueue } from './addRepositoriesToJobQueue';

export const addEntitiesToQueueWorker = async () => {
  await Promise.all([addOrganizationsToJobQueue(), addRepositoriesToJobQueue()]);
};
