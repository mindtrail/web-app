/*
  Warnings:

  - You are about to drop the `DataSrcs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataStores` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CollectionVisibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "DataSourceStatus" AS ENUM ('unsynched', 'pending', 'running', 'synched', 'error', 'usage_limit_reached');

-- CreateEnum
CREATE TYPE "DataSourceType" AS ENUM ('web_page', 'web_site', 'text', 'file', 'google_drive_file', 'google_drive_folder', 'notion');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('qdrant');

-- DropForeignKey
ALTER TABLE "DataSrcs" DROP CONSTRAINT "DataSrcs_dataStoreId_fkey";

-- DropForeignKey
ALTER TABLE "DataSrcs" DROP CONSTRAINT "DataSrcs_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "DataStores" DROP CONSTRAINT "DataStores_ownerId_fkey";

-- DropTable
DROP TABLE "DataSrcs";

-- DropTable
DROP TABLE "DataStores";

-- DropEnum
DROP TYPE "DataSourceStatus";

-- DropEnum
DROP TYPE "DataSourceType";

-- DropEnum
DROP TYPE "DataStoreType";

-- DropEnum
DROP TYPE "DataStoreVisibility";

-- CreateTable
CREATE TABLE "Collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CollectionType" NOT NULL,
    "visibility" "CollectionVisibility" NOT NULL DEFAULT 'private',
    "config" JSONB,
    "parentId" TEXT,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSources" (
    "id" TEXT NOT NULL,
    "type" "DataSourceType" NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DataSourceStatus" NOT NULL DEFAULT 'unsynched',
    "autoSave" BOOLEAN DEFAULT false,
    "metaDescription" TEXT,
    "pageTitle" TEXT,
    "summary" TEXT,
    "pageContent" TEXT,
    "thumbnail" TEXT,
    "config" JSONB,
    "nbChunks" INTEGER DEFAULT 0,
    "textSize" INTEGER DEFAULT 0,
    "hash" TEXT,
    "nbSynch" INTEGER DEFAULT 0,
    "lastSynch" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataSources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSourceUser" (
    "dataSourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DataSourceUser_pkey" PRIMARY KEY ("dataSourceId","userId")
);

-- CreateTable
CREATE TABLE "CollectionDataSource" (
    "collectionId" TEXT NOT NULL,
    "dataSourceId" TEXT NOT NULL,

    CONSTRAINT "CollectionDataSource_pkey" PRIMARY KEY ("collectionId","dataSourceId")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSourceTag" (
    "dataSourceId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "DataSourceTag_pkey" PRIMARY KEY ("dataSourceId","tagId")
);

-- CreateTable
CREATE TABLE "Filters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "ownerId" TEXT,
    "collectionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Filters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceUser" ADD CONSTRAINT "DataSourceUser_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceUser" ADD CONSTRAINT "DataSourceUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionDataSource" ADD CONSTRAINT "CollectionDataSource_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionDataSource" ADD CONSTRAINT "CollectionDataSource_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceTag" ADD CONSTRAINT "DataSourceTag_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceTag" ADD CONSTRAINT "DataSourceTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filters" ADD CONSTRAINT "Filters_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filters" ADD CONSTRAINT "Filters_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
