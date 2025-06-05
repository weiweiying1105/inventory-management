/*
  Warnings:

  - You are about to drop the column `unit` on the `Products` table. All the data in the column will be lost.
  - Added the required column `unit` to the `Sku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "unit";

-- AlterTable
ALTER TABLE "Sku" ADD COLUMN     "unit" TEXT NOT NULL;
