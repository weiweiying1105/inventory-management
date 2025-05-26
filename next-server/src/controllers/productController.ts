import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { uploadToOSS } from "../utils/multerConfig";
const prisma = new PrismaClient()


export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString() || ""
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search
        }
      }
    })
    res.json([
      ...products
    ])

  } catch (error) {
    res.status(500).json({ error: "get product  Error" })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, rating, image, specs, defaultSku } = req.body;

    if (!name || !defaultSku) {
      return res.status(400).json({
        error: '产品名称和默认SKU为必填项'
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 创建产品基本信息
      const product = await tx.products.create({
        data: {
          name,
          price: Number(price),
          rating: rating ? Number(rating) : 0,
          image: image || ''
        }
      });

      // 创建默认SKU
      await tx.sku.create({
        data: {
          productId: product.productId,
          price: Number(defaultSku.price),
          stock: Number(defaultSku.stock),
          code: defaultSku.code || `${product.productId}-default`,
          isDefault: true
        }
      });

      // 如果有规格信息，创建规格组和规格值
      if (specs?.groups) {
        await Promise.all(
          specs.groups.map(async (group: any) => {
            await tx.specGroup.create({
              data: {
                name: group.name,
                productId: product.productId,
                values: {
                  create: group.values.map((value: string) => ({
                    value: value
                  }))
                }
              }
            });
          })
        );
      }

      return product;
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('创建产品错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '创建产品失败'
    });
  }
}

// 获取产品详情（包含规格信息）
export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: { productId: Number(id) },
      include: {
        specGroups: {
          include: {
            values: true
          }
        },
        skus: {
          include: {
            specValues: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: '产品不存在'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取产品详情失败'
    });
  }
}

// 创建商品SKU
export const createProductSku = async (req: Request, res: Response) => {
  try {
    const { productId, skuList } = req.body;

    const skus = await prisma.$transaction(
      skuList.map((sku: any) =>
        prisma.sku.create({
          data: {
            productId: Number(productId),
            price: Number(sku.price),
            stock: Number(sku.stock),
            code: sku.code,
            specValues: {
              connect: sku.specValueIds.map((id: number) => ({ id }))
            }
          }
        })
      )
    );

    res.json({
      success: true,
      data: skus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建SKU失败'
    });
  }
}

// 更新SKU库存
export const updateSkuStock = async (req: Request, res: Response) => {
  try {
    const { skuId, stock } = req.body;

    const sku = await prisma.sku.update({
      where: { id: Number(skuId) },
      data: { stock: Number(stock) }
    });

    res.json({
      success: true,
      data: sku
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新库存失败'
    });
  }
}