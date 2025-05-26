/*
  Warnings:

  - You are about to drop the column `stockQuantity` on the `Products` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "stockQuantity",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sku" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;
