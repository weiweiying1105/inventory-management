/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: 支出管理
 */

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: 按分类获取支出数据
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: 成功返回支出数据
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                   amount:
 *                     type: number
 */

import { Router } from "express";
import { getExpenseByCategory } from "../controllers/expenseController";

const router = Router();

router.get('/', getExpenseByCategory)

export default router;