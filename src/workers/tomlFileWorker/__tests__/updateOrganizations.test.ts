import { prisma } from '../../../lib/dbClient';
import { updateOrganizations } from '../updateOrganizations';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { mockOrganizations } from '../../../__mocks__/mocks';

describe('updateOrganizations', () => {
  const mockPrisma = mockDeep<PrismaClient>();
  (prisma as unknown) = mockPrisma; // mock the prisma client

  afterEach(() => {
    mockReset(mockPrisma);
  });

  it('creates organizations successfully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    mockPrisma.owner.upsert.mockResolvedValueOnce({} as any);

    await updateOrganizations('npm', mockOrganizations);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockPrisma.owner.upsert).toHaveBeenCalledTimes(mockOrganizations.length);
  });
});
