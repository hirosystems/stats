import { parseAndValidateTomlFileContent, Data } from '../parseAndValidateTomlFileContent';
import {
  mockEcosystemTitle,
  mockInvalidTomlFileContent,
  mockOrganizations,
  mockRepos,
  mockSubEcosystems,
  mockValidTomlFileContent,
} from '../../../__mocks__/mocks';

describe('parseAndValidateTomlFileContent', () => {
  it('should parse and validate TOML file content', async () => {
    const result: Data = await parseAndValidateTomlFileContent(mockValidTomlFileContent);

    expect(result).toBeDefined();
    expect(result.ecosystem).toEqual(mockEcosystemTitle);
    expect(result.subEcosystems).toEqual(
      mockSubEcosystems.map(subEcosystem => {
        const nameSnakeCase = subEcosystem.toLowerCase().replace(/ /g, '-');
        return {
          subEcosystem,
          tomlFileUrl: `https://raw.githubusercontent.com/electric-capital/crypto-ecosystems/master/data/ecosystems/${nameSnakeCase[0]}/${nameSnakeCase}.toml`,
        };
      })
    );
    expect(result.organizations).toEqual(mockOrganizations);
    expect(result.repos).toEqual(mockRepos);
  });

  it('should throw an error if TOML file content is invalid', async () => {
    await expect(parseAndValidateTomlFileContent(mockInvalidTomlFileContent)).rejects.toThrowError(
      'Invalid toml file:'
    );
  });
});
