
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
interface ExpenseSummary {
  category: string;
  total: number;
  amount: number
}
interface ExpenseSummaryResponse {
  category: string;
  date: Date;
  expenseSummaryId: string;
  expenseByCategoryId: string;
  amount: string;
}

const prisma = new PrismaClient();
export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    // 获取最受欢迎的产品
    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: [
        {
          skus: {
            _count: 'desc' // Order by total SKU stock instead
          }
        }
      ],
      include: {
        skus: true
      }
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
    const expenseByCategorySummary = expenseByCategory.map((item: any) => ({
      ...item,
      amount: item.amount.toString()
    }))
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


export const getExpenseByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseByCategory = await prisma.expenseByCategory.findMany({
      orderBy: {
        date: 'desc'
      }
    })

    const expenseByCategorySummary = expenseByCategory.map((item: any) => ({
      ...item,
      amount: item.amount.toString(),
    }))

    res.status(200).json(expenseByCategorySummary)
  } catch (error) {
    console.log('获取dashboard数据失败', error);
    res.status(500).json({
      message: "Error retrieving dashboard metrics",

    })
  }
}