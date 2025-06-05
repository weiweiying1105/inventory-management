/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: 仪表盘数据
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: 获取仪表盘数据
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: 成功返回仪表盘数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 salesMetrics:
 *                   type: object
 *                 purchaseMetrics:
 *                   type: object
 *                 expenseMetrics:
 *                   type: object
 */

import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";

const router = Router();

router.get("/", getDashboardMetrics);

export default router;