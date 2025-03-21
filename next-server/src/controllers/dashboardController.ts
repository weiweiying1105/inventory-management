
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    // 获取最受欢迎的产品
    const popularProducts = await prisma.products.findMany({
      take: 15,// 限制返回的产品数量
      orderBy: {
        stockQuantity: "desc", // 按库存数量降序排序
      },
    });
    // 获取销售摘要
    const salesSummary = await prisma.salesSummary.findMany({
      take: 15,
      orderBy: {
        date: "desc",
      },
    });
    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 15,
      orderBy: {
        date: "desc",
      },
    });
    const expenseSummary = await prisma.expenseSummary.findMany({
      take: 15,
      orderBy: {
        date: "desc",
      },
    });
    const expenseByCategory = await prisma.expenseByCategory.findMany({
      take: 15,
      orderBy: {
        date: "desc",
      },
    });
    const expenseByCategorySummary = expenseByCategory.map((item) => {
      return {
        ...item,
        amount: item.amount.toString()
      }
    })
    res.status(200).json({
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary
    })
  } catch (error) {
    console.log('获取dashboard数据失败', error);
    res.status(500).json({
      message: "Error retrieving dashboard metrics",

    })
  }
}