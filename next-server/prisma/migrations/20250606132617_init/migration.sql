/*
  Warnings:

  - You are about to drop the column `status` on the `Banner` table. All the data in the column will be lost.
  - The primary key for the `_SkuToSpecValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_SkuToSpecValue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "_SkuToSpecValue" DROP CONSTRAINT "_SkuToSpecValue_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_SkuToSpecValue_AB_unique" ON "_SkuToSpecValue"("A", "B");
