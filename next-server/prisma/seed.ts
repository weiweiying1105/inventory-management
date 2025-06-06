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
        skus: {
          create: {
            retailPrice: product.price,
            wholesalePrice: product.price,
            memberPrice: product.price,
            stock: 100,
            isDefault: true,
            code: `${product.name}-default`,
            unit: '件'
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

// 在创建 SKU 时添加 unit 字段
const defaultSku = {
  retailPrice: 29.9,
  wholesalePrice: 19.9,
  memberPrice: 24.9,
  stock: 100,
  isDefault: true,
  code: 'SKU001',
  unit: '个'
};

// 在其他 SKU 创建处也添加 unit 字段
const sku = {
  retailPrice: 29.9,  // 使用具体的价格值而不是未定义的 price 变量
  wholesalePrice: 19.9,
  memberPrice: 24.9,
  stock: 100,
  isDefault: true,
  code: 'SKU001',
  unit: '个'
};
