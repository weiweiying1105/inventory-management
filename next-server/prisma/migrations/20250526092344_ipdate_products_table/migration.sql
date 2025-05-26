-- CreateTable
CREATE TABLE "SpecGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "SpecGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecValue" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "SpecValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sku" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SkuToSpecValue" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SkuToSpecValue_AB_unique" ON "_SkuToSpecValue"("A", "B");

-- CreateIndex
CREATE INDEX "_SkuToSpecValue_B_index" ON "_SkuToSpecValue"("B");

-- AddForeignKey
ALTER TABLE "SpecGroup" ADD CONSTRAINT "SpecGroup_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecValue" ADD CONSTRAINT "SpecValue_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SpecGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sku" ADD CONSTRAINT "Sku_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkuToSpecValue" ADD CONSTRAINT "_SkuToSpecValue_A_fkey" FOREIGN KEY ("A") REFERENCES "Sku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkuToSpecValue" ADD CONSTRAINT "_SkuToSpecValue_B_fkey" FOREIGN KEY ("B") REFERENCES "SpecValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
