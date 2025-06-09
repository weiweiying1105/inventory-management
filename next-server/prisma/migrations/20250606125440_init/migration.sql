/*
  Warnings:

  - You are about to drop the column `isActive` on the `Banner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "isActive",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "_SkuToSpecValue" ADD CONSTRAINT "_SkuToSpecValue_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SkuToSpecValue_AB_unique";
