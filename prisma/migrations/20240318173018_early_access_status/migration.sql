/*
  Warnings:

  - Changed the type of `status` on the `EarlyAccess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EarlyAccessStatus" AS ENUM ('new', 'contacted', 'unsubscribed');

-- AlterTable
ALTER TABLE "EarlyAccess" DROP COLUMN "status",
ADD COLUMN     "status" "EarlyAccessStatus" NOT NULL;
