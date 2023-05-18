import { pullTomlFile } from '../pullTomlFile';
import fetchMock from 'jest-fetch-mock';
import { mockValidTomlFileContent } from '../../../__mocks__/mocks';

describe('pullTomlFile', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should pull TOML file content from a URL', async () => {
    const mockFileUrl = 'https://example.com/test.toml';
    fetchMock.mockResponseOnce(mockValidTomlFileContent);

    const result = await pullTomlFile(mockFileUrl);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(mockFileUrl);
    expect(result).toBe(mockValidTomlFileContent);
  });

  it('should throw an error when fetching fails', async () => {
    const mockFileUrl = 'https://example.com/test.toml';
    const mockErrorMessage = 'Failed to fetch';

    fetchMock.mockRejectOnce(new Error(mockErrorMessage));

    await expect(pullTomlFile(mockFileUrl)).rejects.toThrow(mockErrorMessage);
  });
});
