import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 20, categoryId, keyword } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (categoryId) {
      where.categoryId = Number(categoryId); // 保证类型一致
    }
    if (keyword) {
      where.name = { contains: keyword.toString(), mode: 'insensitive' };
    }

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip,
        take,
        orderBy: {
          productId: 'desc'
        },
        select: {
          productId: true,
          name: true,
          images: true,
          categoryId: true,
          // tags: true, // 添加 tag 字段
          skus: {
            select: { retailPrice: true, stock: true, wholesalePrice: true, memberPrice: true }
          }
        }
      }),
      prisma.products.count({
        where
      })
    ])
    const productIds = products.map(p => p.productId);
    const soldCounts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      where: {
        productId: {
          in: productIds,
        },
      },
    });

    const soldCountMap = soldCounts.reduce((acc: Record<number, number>, curr: { productId: number; _sum: { quantity: number | null; } }) => {
      acc[curr.productId] = curr._sum.quantity || 0;
      return acc;
    }, {} as Record<number, number>);

    // 将默认sku零售价作为price字段返回
    const productList = (products as any[]).map(p => {
      const totalStock = p.skus.reduce((sum: number, sku: any) => sum + (sku.stock || 0), 0);
      const soldQuantity = soldCountMap[p.productId] || 0;
      const { name: title, skus, ...rest } = p;
      return {
        ...rest,
        title,
        price: skus && skus[0] ? skus[0].retailPrice : null, // retailPrice as price
        salePrice: skus && skus[0] ? Math.min(skus[0].retailPrice, skus[0].wholesalePrice || Infinity, skus[0].memberPrice || Infinity) : null,
        stockInfo: {
          stockQuantity: totalStock,
          safeStockQuantity: 0,
          soldQuantity: soldQuantity,
        },
      }
    });

    res.status(200).json({
      data: productList,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    })
  } catch (error) {
    res.status(500).json({ error: '服务器错误', detail: error });
  }
}
// 获取商品详情
export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ error: "缺少商品id" });
    const product = await prisma.products.findUnique({
      where: { productId: Number(productId) },
      include: {
        skus: { include: { specValues: true } },
        category: true,
        specGroups: {
          include: {
            values: true
          }
        }
      }
    });
<<<<<<< HEAD

=======
    console.log('@@@@@@product', product)
>>>>>>> 3023bb23849f88507bcc13e508086a8915f16a94
    if (!product) {
      return res.status(404).json({ error: "商品不存在" });
    } else {
      product.skus = product.skus.map(i => {
        const { id, ...rest } = i;
        i.specValues = i.specValues.map(a => {
          return {
            ...a,
            specValueId: a.id
          }
        })
        return {
          ...rest,
          skuId: id,
          stockInfo: {
            stockQuantity: i.stock || 0
          },
          specInfo: i.specValues || []
        } as any
      })
      // console.log('@@@@@@', product)
    }
    const { name: title, images, ...rest } = product
    // 组装前端所需结构
<<<<<<< HEAD
    const details: any = {
      ...product,
      specList: product.specGroups || [],
      skuList: product.skus || [],
      primaryImage: product.images && product.images.length > 0 ? product.images[0] : '',
      limitInfo: [],
    };
    // 计算所有 sku 库存总和
    const totalStock = details.skuList.reduce((sum: number, sku: any) => sum + (sku.stock || 0), 0);
    details.spuStockQuantity = totalStock === 0 ? 0 : totalStock;

    // 计算最低售价和最高售价
    const prices = details.skuList.map((sku: any) => sku.retailPrice).filter((price: any) => price != null);
    details.minSalePrice = prices.length > 0 ? Math.min(...prices) : 0;
    details.maxSalePrice = prices.length > 0 ? Math.max(...prices) : 0;

    // 为每个规格值增加 hasStockObj 字段
    if (details.specList && details.skuList) {
      details.specList.forEach((group: any) => {
        if (group.values && group.values.length > 0) {
          group.values = group.values.map((subItem: any) => {
            return {
              ...subItem,
              specValueId: subItem.id,
              id: undefined,
              specValue: subItem.value,
            };
          });
        }
        group.specId = group.id;

      });
    }
=======
    const totalStock = product.skus.reduce((sum, sku) => sum + (sku.stock || 0), 0);
>>>>>>> 3023bb23849f88507bcc13e508086a8915f16a94
    const soldCount = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: { productId: Number(productId) }
    });
    const soldQuantity = soldCount._sum.quantity || 0;

    const skuSoldCounts = await prisma.orderItem.groupBy({
      by: ['skuId'],
      _sum: {
        quantity: true,
      },
      where: {
        productId: Number(productId),
      },
    });

    const skuSoldCountMap = skuSoldCounts.reduce((acc: Record<number, number>, curr: { skuId: number; _sum: { quantity: number | null; } }) => {
      acc[curr.skuId] = curr._sum.quantity || 0;
      return acc;
    }, {} as Record<number, number>);

    const specGroupMap = new Map(product.specGroups.map(g => [g.id, g.name]));

    const details: any = {
      ...rest,
      title,
      specList: product.specGroups ? product.specGroups.map(group => ({
        specId: group.id.toString(),
        title: group.name,
        specValueList: group.values ? group.values.map(value => ({
          specValueId: value.id.toString(),
          specId: group.id.toString(),
          saasId: null,
          specValue: value.value,
          image: null,
        })) : [],
        stockInfo: {
          stockQuantity: totalStock, // Note: This is the total stock for the product, not the spec group
          safeStockQuantity: 0,
          soldQuantity: soldQuantity, // Note: This is the total sold quantity for the product
        },
      })) : [],
      skuList: product.skus ? product.skus.map(sku => ({
        skuId: sku.id.toString(),
        skuImage: product.images && product.images.length > 0 ? product.images[0] : '', // Assuming the first image is the sku image
        specInfo: sku.specValues.map(sv => ({
          specId: sv.groupId.toString(),
          specTitle: specGroupMap.get(sv.groupId) || null,
          specValueId: sv.id.toString(),
          specValue: sv.value,
        })),
        priceInfo: [
          { priceType: 1, price: sku.retailPrice.toString(), priceTypeName: '零售价' },
          { priceType: 2, price: sku.wholesalePrice?.toString() || '0', priceTypeName: '会员价' },
        ],
        stockInfo: {
          stockQuantity: sku.stock,
          safeStockQuantity: 0, // This needs to be defined
          soldQuantity: skuSoldCountMap[sku.id] || 0,
        },
        weight: { value: sku.weight, unit: 'KG' },
        volume: null, // This needs to be defined
        profitPrice: null, // This needs to be defined
      })) : [],
      primaryImage: product.images && product.images.length > 0 ? product.images[0] : '',
      limitInfo: [],
      spuStockQuantity: totalStock,
      soldCount: soldQuantity,
    };
    console.log('@@@@@@产品详情', details)

    res.json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ error: "服务器错误", detail: error });
  }
};
