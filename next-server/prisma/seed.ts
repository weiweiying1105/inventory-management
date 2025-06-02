import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface SeedProduct {
  name: string;
  rating?: number;
  image?: string;
  price: number;  // 用于创建 SKU 的价格
}

async function main() {
  const products: SeedProduct[] = [
    {
      name: "测试商品1",
      rating: 4.5,
      price: 99.99,
      image: "https://example.com/image1.jpg"
    }
  ];

  for (const product of products) {
    await prisma.products.create({
      data: {
        name: product.name,
        rating: product.rating || 0,
        image: product.image || '',
        unit: '件',
        skus: {
          create: {
            retailPrice: product.price,    // 使用 price 创建 SKU
            wholesalePrice: product.price,
            memberPrice: product.price,
            stock: 100,
            isDefault: true,
            code: `${product.name}-default`
          }
        }
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
