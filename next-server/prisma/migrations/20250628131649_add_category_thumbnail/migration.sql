-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'UNPAID';
ALTER TYPE "OrderStatus" ADD VALUE 'TO_BE_SHIPPED';
ALTER TYPE "OrderStatus" ADD VALUE 'TO_BE_RECEIVED';
ALTER TYPE "OrderStatus" ADD VALUE 'TO_BE_REVIEWED';
ALTER TYPE "OrderStatus" ADD VALUE 'AFTER_SALE';

-- DropIndex
DROP INDEX "Sku_productId_idx";

-- DropIndex
DROP INDEX "Sku_productId_isDefault_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "thumbnail" TEXT;

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "openid" TEXT NOT NULL,
    "skuId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cart_openid_idx" ON "Cart"("openid");

-- CreateIndex
CREATE INDEX "Cart_skuId_idx" ON "Cart"("skuId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_openid_skuId_key" ON "Cart"("openid", "skuId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
