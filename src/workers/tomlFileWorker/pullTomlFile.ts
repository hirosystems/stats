import fetch from 'node-fetch';
import { logger } from '../../lib/logger';

export const pullTomlFile = async (fileUrl: string) => {
  logger.info(`Pulling toml file ${fileUrl}...`);
  const response = await fetch(fileUrl);
  const data = await response.text();
  return data;
};
