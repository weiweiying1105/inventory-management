/**
 * @swagger
 * tags:
 *   name: Pictures
 *   description: 图片管理
 */

/**
 * @swagger
 * /picture/list:
 *   get:
 *     summary: 获取所有图片
 *     tags: [Pictures]
 *     responses:
 *       200:
 *         description: 成功返回图片列表
 */

/**
 * @swagger
 * /picture/add:
 *   post:
 *     summary: 批量添加图片
 *     tags: [Pictures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     name:
 *                       type: string
 *     responses:
 *       200:
 *         description: 图片添加成功
 */

import { Router } from "express";
import { getAllPictures, addAllPictures } from "../controllers/pictureController";

const router = Router()

router.get('/list', getAllPictures)

router.post('/add', addAllPictures)

export default router