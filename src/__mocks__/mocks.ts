export const mockEcosystemTitle = 'Ecosystem Title';
export const mockSubEcosystems = ['SubEcosystems-1', 'SubEcosystems-2', 'SubEcosystems-3'];
export const mockOrganizations = ['Organization-1', 'Organization-2', 'Organization-3'];
export const mockRepos = ['Repo-1', 'Repo-2', 'Repo-3'];
export const mockValidTomlFileContent = `
      # Ecosystem Level Information
      title = "${mockEcosystemTitle}"
      
      sub_ecosystems = [${mockSubEcosystems.map(subEcosystem => `"${subEcosystem}"`).join(', ')}]
      
      github_organizations = [${mockOrganizations
        .map(organization => `"${organization}"`)
        .join(', ')}]
      
      # Repositories
      [[repo]]
      url = "${mockRepos[0]}"
      
      [[repo]]
      url = "${mockRepos[1]}"
      
      [[repo]]
      url = "${mockRepos[2]}"
    `;
export const mockInvalidTomlFileContent = `
      # No ecosystem title!
      
      sub_ecosystems = [${mockSubEcosystems.map(subEcosystem => `"${subEcosystem}"`).join(', ')}]
      
      github_organizations = [${mockOrganizations
        .map(organization => `"${organization}"`)
        .join(', ')}]
      
      # Repositories
      [[repo]]
      url = "${mockRepos[0]}"
      
      [[repo]]
      url = "${mockRepos[1]}"
      
      [[repo]]
      url = "${mockRepos[2]}"
    `;

export const mockWeeklyContributions = [
  {
    author: { login: 'contributor1', type: 'User' },
    weeks: [
      { w: 1577854800, a: 10, d: 2, c: 2 },
      { w: 1578459600, a: 20, d: 4, c: 3 },
    ],
  },
  {
    author: { login: 'contributor2', type: 'User' },
    weeks: [
      { w: 1577854800, a: 10, d: 2, c: 2 },
      { w: 1578459600, a: 20, d: 4, c: 3 },
    ],
  },
];
