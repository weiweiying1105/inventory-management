/*
  Warnings:

  - You are about to drop the column `price` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Sku` table. All the data in the column will be lost.
  - Added the required column `unit` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retailPrice` to the `Sku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wholesalePrice` to the `Sku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "price",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isHot" BOOLEAN DEFAULT false,
ADD COLUMN     "isNew" BOOLEAN DEFAULT false,
ADD COLUMN     "isPopular" BOOLEAN DEFAULT false,
ADD COLUMN     "isRecommend" BOOLEAN DEFAULT false,
ADD COLUMN     "storageMethod" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sku" DROP COLUMN "price",
ADD COLUMN     "memberPrice" DOUBLE PRECISION,
ADD COLUMN     "packageSize" TEXT,
ADD COLUMN     "retailPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "wholesalePrice" DOUBLE PRECISION NOT NULL;
