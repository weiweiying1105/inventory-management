import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";

const prisma = new PrismaClient()

export const getAllategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findMany();
    res.status(200).json({
      list: category
    })
  } catch (error) {

    res.status(500).json({
      message: error
    })
  }
}

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;
    const category = await prisma.category.create({
      data: { categoryName }
    })
    res.status(200).json({
      message: '操作成功',
      data: {
        id: category.id
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
}
// 修改类型

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id, categoryName } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { categoryName }
    })
    res.status(200).json({
      message: '操作成功',
      data: {
        id: category.id
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
}



// 删除
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const category = prisma.category.delete({
      where: { id: Number(id) }
    })
    res.status(200).json({
      message: '操作成功',
      data: {}
    })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }

}
