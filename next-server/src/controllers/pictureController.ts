import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 分页获取所有图片
export const getAllPictures = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const [pictures, total] = await Promise.all([
      prisma.pictures.findMany({
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.pictures.count()
    ]);

    res.json({
      list: pictures,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取图片列表失败'
    });
  }
}
