import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
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
    const product = await prisma.products.create({
      data: {
        name: name,
        price: price,
        rating: rating,
        stockQuantity: stockQuantity,
        image: image || '' // Add the required image field
      }
    })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' })
  }
}