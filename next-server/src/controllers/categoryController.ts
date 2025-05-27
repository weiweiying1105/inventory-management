import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 获取所有分类（包含层级结构）
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        AND: [
          { parentId: null }  // 修改查询条件格式
        ]
      },
      include: {
        subCategory: {
          include: {
            subCategory: true
          }
        },
        products: true
      }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取分类列表失败'
    });
  }
};

// 创建分类
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName, description, parentId, subCategoryName } = req.body;

    const category = await prisma.category.create({
      data: {
        categoryName,
        description,
        parentId: parentId ? Number(parentId) : null,
        subCategoryName
      }
    });

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建分类失败'
    });
  }
};

// 更新分类
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryName, description, parentId, subCategoryName } = req.body;

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        categoryName,
        description,
        parentId: parentId ? Number(parentId) : null,
        subCategoryName
      }
    });

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新分类失败'
    });
  }
};

// 删除分类
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.delete({
      where: { id: Number(id) }
    });

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除分类失败'
    });
  }
};
