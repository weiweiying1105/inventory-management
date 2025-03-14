/*
  Warnings:

  - The primary key for the `Products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `Products` table. All the data in the column will be lost.
  - The primary key for the `Purchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[purchaseId]` on the table `Purchases` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[saleId]` on the table `Sales` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `Products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_productId_fkey";

-- DropForeignKey
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_productId_fkey";

-- AlterTable
ALTER TABLE "Products" DROP CONSTRAINT "Products_pkey",
DROP COLUMN "productId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ALTER COLUMN "rating" SET NOT NULL,
ADD CONSTRAINT "Products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Purchases_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Sales_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Purchases_purchaseId_key" ON "Purchases"("purchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Sales_saleId_key" ON "Sales"("saleId");

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
