import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ExpenseCategoryResponse {
  expenseByCategoryId: string;
  expenseSummaryId: string;
  category: string;
  amount: string;
  date: Date;
}

export const getExpenseByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
      orderBy: {
        date: 'desc'
      }
    })

    const expenseByCategorySummary = expenseByCategorySummaryRaw.map((expense) => ({
      ...expense,
      amount: expense.amount.toString(),
    }))

    res.status(200).json(
      expenseByCategorySummary
    )
  } catch (error) {
    res.status(500).json({ error: "Error fetching expense by category summary" });
  }
}