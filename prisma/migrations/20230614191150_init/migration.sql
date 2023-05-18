-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "Owner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "lastFetchedAt" TIMESTAMP(3),
    "ecosystem" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER,
    "lastFetchedAt" TIMESTAMP(3),
    "ecosystem" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contributor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepositoryContributor" (
    "repositoryId" INTEGER NOT NULL,
    "contributorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepositoryContributor_pkey" PRIMARY KEY ("repositoryId","contributorId")
);

-- CreateTable
CREATE TABLE "WeeklyContribution" (
    "weekStartDateTs" INTEGER NOT NULL,
    "numberOfAdditions" INTEGER NOT NULL,
    "numberOfDeletions" INTEGER NOT NULL,
    "numberOfCommits" INTEGER NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    "contributorId" INTEGER NOT NULL,

    CONSTRAINT "WeeklyContribution_pkey" PRIMARY KEY ("repositoryId","contributorId","weekStartDateTs")
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_name_key" ON "Owner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_name_key" ON "Repository"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_name_key" ON "Contributor"("name");

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryContributor" ADD CONSTRAINT "RepositoryContributor_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryContributor" ADD CONSTRAINT "RepositoryContributor_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyContribution" ADD CONSTRAINT "WeeklyContribution_repositoryId_contributorId_fkey" FOREIGN KEY ("repositoryId", "contributorId") REFERENCES "RepositoryContributor"("repositoryId", "contributorId") ON DELETE RESTRICT ON UPDATE CASCADE;
