import toml from 'toml';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { logger } from '../../lib/logger';

export interface TomlFile {
  title: string;
  sub_ecosystems: string[];
  github_organizations: string[];
  repo: { url: string }[];
}

export interface Data {
  ecosystem: string;
  organizations: string[];
  repos: string[];
  subEcosystems: { subEcosystem: string; tomlFileUrl: string }[];
}

const ajv = new Ajv();

const schema: JTDSchemaType<TomlFile> = {
  properties: {
    title: { type: 'string' },
    sub_ecosystems: { elements: { type: 'string' } },
    github_organizations: { elements: { type: 'string' } },
    repo: {
      elements: {
        properties: {
          url: {
            type: 'string',
          },
        },
        additionalProperties: true,
      },
    },
  },
};

const validate = ajv.compile(schema);

export const parseAndValidateTomlFileContent = async (tomlFileContent: string): Promise<Data> => {
  logger.info('Parsing toml file content...');
  const fileContent = toml.parse(tomlFileContent);
  if (!validate(fileContent)) {
    throw new Error(`Invalid toml file: ${JSON.stringify(validate.errors, null, 2)}`);
  }

  const subEcosystems = [...new Set(fileContent.sub_ecosystems)].map(subEcosystem => {
    const nameSnakeCase = subEcosystem.toLowerCase().replace(/ /g, '-');
    return {
      subEcosystem,
      tomlFileUrl: `https://raw.githubusercontent.com/electric-capital/crypto-ecosystems/master/data/ecosystems/${nameSnakeCase[0]}/${nameSnakeCase}.toml`,
    };
  });

  return {
    ecosystem: fileContent.title,
    subEcosystems,
    organizations: [...new Set(fileContent.github_organizations)],
    repos: [...new Set(fileContent.repo.map(repo => repo.url))],
  };
};
