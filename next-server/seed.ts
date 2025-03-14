import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  // Read seed data from JSON files
  const productsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, './prisma/seedData/products.json'), 'utf-8')
  )
  const salesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, './prisma/seedData/sales.json'), 'utf-8')
  )
  const purchasesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, './prisma/seedData/purchases.json'), 'utf-8')
  )

  // Clear existing data
  await prisma.sales.deleteMany()
  await prisma.purchases.deleteMany()
  await prisma.products.deleteMany()

  // Seed products first and store their IDs
  const productIdMap = new Map();
  for (const product of productsData) {
    const createdProduct = await prisma.products.create({
      data: {
        productId: product.productId,
        name: product.name,
        price: product.price,
        rating: product.rating,
        stockQuantity: product.stockQuantity,
        image: product.image
      }
    });
    productIdMap.set(product.productId, createdProduct.productId);
  }

  // Seed sales with correct product references
  for (const sale of salesData) {
    await prisma.sales.create({
      data: {
        saleId: sale.saleId,
        productId: productIdMap.get(sale.productId), // 使用映射的 productId
        timestamp: new Date(sale.timestamp),
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        totalAmount: sale.totalAmount
      }
    });
  }

  // Seed purchases
  for (const purchase of purchasesData) {
    await prisma.purchases.create({
      data: {
        purchaseId: purchase.purchaseId,
        productId: purchase.productId,
        timestamp: new Date(purchase.timestamp),
        quantity: purchase.quantity,
        unitCost: purchase.unitCost,
        totalCost: purchase.totalCost
      }
    })
  }

  console.log('Database seeding completed')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })