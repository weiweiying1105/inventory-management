import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { uploadToOSS } from "../utils/multerConfig";
const prisma = new PrismaClient()

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString() || ""
    const isHot = req.query.isHot === 'true'
    const isPopular = req.query.isPopular === 'true'
    const isNew = req.query.isNew === 'true'
    const isRecommend = req.query.isRecommend === 'true'
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const skip = (page - 1) * pageSize

    const where = {
      name: { contains: search },
      ...(isHot && { isHot: true }),
      ...(isPopular && { isPopular: true }),
      ...(isNew && { isNew: true }),
      ...(isRecommend && { isRecommend: true })
    }

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          productId: true, // 明确返回产品id
          name: true,
          images: true,
          thumb: true, // 主图
          isHot: true,
          isPopular: true,
          isNew: true,
          isRecommend: true,
          createdAt: true,
          storageMethod: true,
          rating: true,
          description: true,
          category: {
            select: {
              id: true,
              categoryName: true // 分类名称
            }
          },
          skus: {
            where: { isDefault: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.products.count({ where })
    ])

    res.json({
      success: true,
      data: {
        list: products,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "获取商品列表失败:" + error
    })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      categoryId,
      storageMethod,
      description,
      images,
      thumb,
      rating,
      isHot,
      isPopular,
      isNew,
      isRecommend,
      skus,
      defaultSku,
      specGroups,
      tags, // 新增 tags 字段
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: '商品名称为必填项'
      });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 创建产品基本信息和规格组
      const product = await tx.products.create({
        data: {
          name,
          category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
          storageMethod,
          description,
          images: images || [],
          thumb: thumb || null,
          rating: rating ? Number(rating) : 0,
          isHot: isHot || false,
          isPopular: isPopular || false,
          isNew: isNew || false,
          isRecommend: isRecommend || false,
          tags: tags || [], // 保存标签
          // 创建规格组和规格值
          specGroups: {
            create: specGroups?.map((group: any) => ({
              name: group.name,
              values: {
                create: group.values?.map((value: any) => ({
                  value: value.value
                })) || []
              }
            })) || []
          }
        },
        include: {
          specGroups: {
            include: {
              values: true
            }
          }
        }
      });

      // 批量创建SKU，简化逻辑
      if (skus && skus.length > 0) {
        // 创建ID映射
        const specValueIdMap = new Map<string, number>();
        product.specGroups.forEach((group: any) => {
          group.values.forEach((value: any, index: number) => {
            const frontendId = `${group.name}_${index}`;
            specValueIdMap.set(frontendId, value.id);
          });
        });

        // 准备SKU数据
        const skuData = skus.map((sku: any) => {
          const actualSpecValueIds = sku.specValueIds?.map((frontendId: string) =>
            specValueIdMap.get(frontendId)
          ).filter((id: number | undefined) => id !== undefined) || [];

          return {
            productId: product.productId,
            unit: sku.unit || '',
            retailPrice: Number(sku.retailPrice) || 0,
            wholesalePrice: Number(sku.wholesalePrice) || 0,
            memberPrice: Number(sku.memberPrice) || 0,
            weight: Number(sku.weight) || 0,
            dimensions: sku.dimensions || '',
            stock: Number(sku.stock) || 0,
            code: sku.code || '',
            isDefault: sku.isDefault || false,
            specValueIds: actualSpecValueIds
          };
        });

        // 批量创建SKU
        for (const skuItem of skuData) {
          const { specValueIds, ...skuCreateData } = skuItem;
          await tx.sku.create({
            data: {
              ...skuCreateData,
              specValues: {
                connect: specValueIds.map((id: number) => ({ id }))
              }
            }
          });
        }
      } else {
        // 创建默认SKU
        await tx.sku.create({
          data: {
            productId: product.productId,
            unit: defaultSku?.unit || '',
            retailPrice: Number(defaultSku?.retailPrice) || 0,
            wholesalePrice: Number(defaultSku?.wholesalePrice) || 0,
            memberPrice: Number(defaultSku?.memberPrice) || 0,
            weight: Number(defaultSku?.weight) || 0,
            dimensions: defaultSku?.dimensions || '',
            stock: Number(defaultSku?.stock) || 0,
            code: defaultSku?.code || '',
            isDefault: true
          }
        });
      }

      return product;
    }, {
      timeout: 10000 // 设置10秒超时
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建商品失败：' + error
    });
  }
};



// 创建商品SKU
export const createProductSku = async (req: Request, res: Response) => {
  try {
    const { productId, skuList } = req.body;
    // Prisma 的事务（Transaction）功能。保证多个数据库操作全部成功，否则全部回滚。保证数据一致性
    const skus = await prisma.$transaction(
      skuList.map((sku: any) =>
        prisma.sku.create({
          data: {
            productId: Number(productId),
            retailPrice: Number(sku.price),
            wholesalePrice: Number(sku.price),
            memberPrice: Number(sku.price),
            stock: Number(sku.stock),
            code: sku.code,
            unit: sku.unit, // 添加此行以确保 unit 字段存在
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

// 更新商品状态（热门、新品、推荐等）
export const updateProductStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isHot, isPopular, isNew, isRecommend } = req.body;

    const product = await prisma.products.update({
      where: { productId: Number(id) },
      data: {
        isHot: isHot !== undefined ? isHot : undefined,
        isPopular: isPopular !== undefined ? isPopular : undefined,
        isNew: isNew !== undefined ? isNew : undefined,
        isRecommend: isRecommend !== undefined ? isRecommend : undefined,
      }
    });

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新商品状态失败'
    });
  }
}
// 修改产品信息
export const updateProductWithSkus = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      name,
      categoryId,
      storageMethod,
      description,
      images,
      thumb,
      rating,
      isHot,
      isPopular,
      isNew,
      isRecommend,
      skus,// 前端传递的sku数组，包含id（有则为更新，无则为新增）、isDefault等字段
      tags,
    } = req.body;

    const result = await prisma.$transaction(async (tx: any) => {
      // 1. 更新商品基本信息
      const product = await tx.products.update({
        where: { productId: Number(productId) },
        data: {
          name,
          categoryId: categoryId ? Number(categoryId) : null,
          storageMethod,
          description,
          images: images || [],
          thumb: thumb || null,
          rating: rating ? Number(rating) : 0,
          isHot: isHot || false,
          isPopular: isPopular || false,
          isNew: isNew || false,
          isRecommend: isRecommend || false,
          tags: tags || []
        }
      });

      // 2. 批量处理SKU
      for (const sku of skus) {
        if (sku.id) {
          // 更新已有SKU
          await tx.sku.update({
            where: { id: Number(sku.id) },
            data: {
              retailPrice: Number(sku.retailPrice),
              wholesalePrice: Number(sku.wholesalePrice),
              memberPrice: Number(sku.memberPrice),
              stock: Number(sku.stock),
              code: sku.code,
              unit: sku.unit,
              isDefault: !!sku.isDefault,
              specValues: {
                set: sku.specValueIds?.map((id: number) => ({ id })) || []
              }
            }
          });
        } else {
          // 新增SKU
          await tx.sku.create({
            data: {
              productId: Number(productId),
              retailPrice: Number(sku.retailPrice),
              wholesalePrice: Number(sku.wholesalePrice),
              memberPrice: Number(sku.memberPrice),
              stock: Number(sku.stock),
              code: sku.code,
              unit: sku.unit,
              isDefault: !!sku.isDefault,
              specValues: {
                connect: sku.specValueIds?.map((id: number) => ({ id })) || []
              }
            }
          });
        }
      }
      // 3. 可选：删除未在skus中的旧SKU（如需同步删除）
      const existingSkuIds = skus.filter((s: any) => s.id).map((s: any) => Number(s.id));
      await tx.sku.deleteMany({ where: { productId: Number(productId), id: { notIn: existingSkuIds } } });

      return product;
    }, {
      timeout: 10000, // 增加到10秒
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新商品及SKU失败:' + error
    });
  }
}
export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
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
        //{
        // include: {
        //   specValues: true // 添加这一行以包含 skuValues
        // }
        // }

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
      error: '获取产品详情失败:' + error
    });
  }
}