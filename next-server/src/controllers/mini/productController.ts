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
          thumb: true, // 添加 thumb 字段
          productId: true,
          name: true,
          images: true,
          categoryId: true,
          tags: true, // 添加 tag 字段
          skus: {
            where: { isDefault: true },
            select: { retailPrice: true }
          }
        }
      }),
      prisma.products.count({
        where
      })
    ])
    // 将默认sku零售价作为price字段返回
    const productList = (products as any[]).map(p => ({
      ...p,
      price: p.skus && p.skus[0] ? p.skus[0].retailPrice : null,
      skus: undefined
    }))

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
    // 组装前端所需结构
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
    const soldCount = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: { productId: Number(productId) }
    });
    details.soldCount = soldCount._sum.quantity || 0;
    res.json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ error: "服务器错误", detail: error });
  }
};
