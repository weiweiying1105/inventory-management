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


// 保存图片
export const addAllPictures = async (req: Request, res: Response) => {
  try {
    const { url, name } = req.body;
    if (!url || !name) {
      return res.status(400).json({
        success: false,
        error: 'URL和名称不能为空'
      });
    }
    const picture = await prisma.pictures.create({
      data: {
        url,
        name
      }
    });
    res.status(200).json({
      success: true,
      data: picture
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '保存图片失败'
    });
  }
}