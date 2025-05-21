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
    const { name, price, rating, stockQuantity, image } = req.body;

    if (!name || !price || !stockQuantity) {
      return res.status(400).json({
        error: '产品名称、价格和库存量为必填项'
      });
    }

    // Check if product with same name exists
    const existingProduct = await prisma.products.findFirst({
      where: { name }
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: '产品名称已存在'
      });
    }

    const product = await prisma.products.create({
      data: {
        name,
        price: Number(price),
        rating: rating ? Number(rating) : 0,
        stockQuantity: Number(stockQuantity),
        image: image || ''
      }
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('创建产品错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '创建产品失败'
    });
  }
}