/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: 商品分类管理
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: 获取所有分类
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: 成功返回分类列表
 *
 *   post:
 *     summary: 创建新分类
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *               subCategoryName:
 *                 type: string
 *               description:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 分类创建成功
 */

/**
 * @swagger
 * /category/delete:
 *   post:
 *     summary: 删除分类
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 分类删除成功
 */

/**
 * @swagger
 * /category/update:
 *   post:
 *     summary: 更新分类
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               categoryName:
 *                 type: string
 *               subCategoryName:
 *                 type: string
 *               description:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 分类更新成功
 */

import { Router } from "express";
import { getAllCategories, createCategory, deleteCategory, updateCategory } from "../controllers/categoryController";
const router = Router()

router.get('/', getAllCategories)
router.post('/', createCategory)
router.post('/delete', deleteCategory)
router.post('/update', updateCategory)
export default router