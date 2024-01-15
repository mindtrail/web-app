/*
  Warnings:

  - You are about to drop the `CollectionNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataSourceClipping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataSourceNote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dataSourceId` to the `Clippings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClippingType" AS ENUM ('text', 'file');

-- DropForeignKey
ALTER TABLE "CollectionNote" DROP CONSTRAINT "CollectionNote_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionNote" DROP CONSTRAINT "CollectionNote_noteId_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceClipping" DROP CONSTRAINT "DataSourceClipping_clippingId_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceClipping" DROP CONSTRAINT "DataSourceClipping_dataSourceId_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceNote" DROP CONSTRAINT "DataSourceNote_dataSourceId_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceNote" DROP CONSTRAINT "DataSourceNote_noteId_fkey";

-- AlterTable
ALTER TABLE "Clippings" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "dataSourceId" TEXT NOT NULL,
ADD COLUMN     "type" "ClippingType" NOT NULL DEFAULT 'text',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "clippingId" TEXT,
ADD COLUMN     "dataSourceId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "CollectionNote";

-- DropTable
DROP TABLE "DataSourceClipping";

-- DropTable
DROP TABLE "DataSourceNote";

-- AddForeignKey
ALTER TABLE "Clippings" ADD CONSTRAINT "Clippings_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clippings" ADD CONSTRAINT "Clippings_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_clippingId_fkey" FOREIGN KEY ("clippingId") REFERENCES "Clippings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
