
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getHomeData = async (req: Request, res: Response) => {
  try {
    // 获取 Banner 列表
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sort: 'asc' }
    });

    // 获取热门商品
    const hotProducts = await prisma.products.findMany({
      where: {
        isHot: true
      },
      take: 6,
      include: {
        category: true,
        skus: {
          where: {
            isDefault: true
          }
        }
      }
    });

    // 获取推荐商品
    const recommendProducts = await prisma.products.findMany({
      where: {
        isRecommend: true
      },
      take: 8,
      include: {
        category: true,
        skus: {
          where: {
            isDefault: true
          }
        }
      }
    });

    return res.json({
      code: 200,
      data: {
        banners,
        hotProducts,
        recommendProducts
      },
      msg: '获取成功'
    });
  } catch (error) {
    console.error('获取首页数据失败:', error);
    return res.status(500).json({
      code: 500,
      msg: '获取首页数据失败'
    });
  }
};