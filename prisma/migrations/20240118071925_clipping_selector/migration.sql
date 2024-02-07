/*
  Warnings:

  - You are about to drop the column `range` on the `Clippings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clippings" DROP COLUMN "range",
ADD COLUMN     "selector" JSONB;
