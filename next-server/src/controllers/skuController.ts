import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// 添加商品规格
export const addProductSpecs = async (req: Request, res: Response) => {
  try {
    const { productId, specs } = req.body;

    // specs 格式示例：
    // {
    //   groups: [
    //     {
    //       name: "颜色",
    //       values: ["红色", "蓝色"]
    //     },
    //     {
    //       name: "尺寸",
    //       values: ["S", "M", "L"]
    //     }
    //   ]
    // }

    const result = await prisma.$transaction(async (tx: any) => {
      // 创建规格组和规格值
      const groups = await Promise.all(
        specs.groups.map(async (group: any) => {
          const specGroup = await tx.specGroup.create({
            data: {
              name: group.name,
              productId: productId,
              values: {
                create: group.values.map((value: string) => ({
                  value: value
                }))
              }
            },
            include: {
              values: true
            }
          });
          return specGroup;
        })
      );

      return groups;
    });

    res.json({
      code: 200,
      message: "规格添加成功",
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: "添加规格失败", message: error });
  }
};

// 创建SKU
export const createSku = async (req: Request, res: Response) => {
  try {
    const { productId, skuList } = req.body;
    // 查询该商品所有规格组及规格值，建立临时 id 到真实 id 的映射
    const product = await prisma.products.findUnique({
      where: { productId: Number(productId) },
      include: {
        specGroups: { include: { values: true } }
      }
    });
    const specValueIdMap = new Map();
    product?.specGroups.forEach((group: any) => {
      group.values.forEach((value: any, index: number) => {
        const frontendId = `${group.name}_${index}`;
        specValueIdMap.set(frontendId, value.id);
      });
    });
    const skus = await prisma.$transaction(
      skuList.map((sku: any) => {
        // 将前端传来的临时 id 转换为真实 id
        const actualSpecValueIds = sku.specValueIds?.map((frontendId: string) => specValueIdMap.get(frontendId)).filter((id: number | undefined) => id !== undefined) || [];
        return prisma.sku.create({
          data: {
            productId: Number(productId),
            unit: sku.unit,
            retailPrice: Number(sku.retailPrice),
            wholesalePrice: Number(sku.wholesalePrice),
            memberPrice: Number(sku.memberPrice),
            stock: Number(sku.stock),
            code: sku.code,
            dimensions: sku.dimensions,
            weight: sku.weight,
            isDefault: sku.isDefault || false,
            specValues: {
              connect: actualSpecValueIds.map((id: number) => ({ id }))
            }
          }
        })
      })
    );
    res.json({
      code: 200,
      message: "SKU创建成功",
      data: skus
    });
  } catch (error) {
    res.status(500).json({ error: "创建SKU失败", message: error });
  }
};

// 获取商品的规格和SKU信息
export const getProductSpecs = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await prisma.products.findUnique({
      where: { productId: Number(productId) },
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

    res.json({
      code: 200,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: "获取规格信息失败", message: error });
  }
};