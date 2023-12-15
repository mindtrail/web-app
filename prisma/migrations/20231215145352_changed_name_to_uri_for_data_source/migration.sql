/*
  Warnings:

  - You are about to drop the column `name` on the `DataSources` table. All the data in the column will be lost.
  - Added the required column `uri` to the `DataSources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataSources" DROP COLUMN "name",
ADD COLUMN     "uri" TEXT NOT NULL;
