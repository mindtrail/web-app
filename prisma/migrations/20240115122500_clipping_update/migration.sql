/*
  Warnings:

  - You are about to drop the column `externalResources` on the `Clippings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clippings" DROP COLUMN "externalResources",
ADD COLUMN     "range" JSONB;
