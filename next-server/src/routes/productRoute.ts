/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 商品管理
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 获取所有商品
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: isHot
 *         schema:
 *           type: boolean
 *         description: 是否为热门商品
 *       - in: query
 *         name: isPopular
 *         schema:
 *           type: boolean
 *         description: 是否为流行商品
 *       - in: query
 *         name: isNew
 *         schema:
 *           type: boolean
 *         description: 是否为新品
 *       - in: query
 *         name: isRecommend
 *         schema:
 *           type: boolean
 *         description: 是否为推荐商品
 *     responses:
 *       200:
 *         description: 成功返回商品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   categoryId:
 *                     type: integer
 *                   unit:
 *                     type: string
 *                   storageMethod:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   isPopular:
 *                     type: boolean
 *                   isHot:
 *                     type: boolean
 *                   isNew:
 *                     type: boolean
 *                   isRecommend:
 *                     type: boolean
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       categoryName:
 *                         type: string
 *                   skus:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         retailPrice:
 *                           type: number
 *                         wholesalePrice:
 *                           type: number
 *                         memberPrice:
 *                           type: number
 *                         stock:
 *                           type: integer
 *                         code:
 *                           type: string
 *
 *   post:
 *     summary: 创建新商品
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               unit:
 *                 type: string
 *               storageMethod:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               rating:
 *                 type: number
 *               isPopular:
 *                 type: boolean
 *               isHot:
 *                 type: boolean
 *               isNew:
 *                 type: boolean
 *               isRecommend:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 商品创建成功
 *       400:
 *         description: 请求参数错误
 */

import { Router } from "express";
import { getAllProducts, createProduct, updateProductStatus, updateProductWithSkus, getProductDetail } from '../controllers/productController';

const router = Router();

router.get('/', getAllProducts);
router.post('/', createProduct);
router.patch('/:id/status', updateProductStatus);
router.patch('/update', updateProductWithSkus);
router.get('/detail', getProductDetail);

export default router;