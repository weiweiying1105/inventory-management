/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: 文件上传
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: 上传图片
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: 要上传的图片文件
 *     responses:
 *       200:
 *         description: 图片上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: 上传后的图片URL
 */

import express from 'express';
import { uploadImage } from '../controllers/uploadController';
import upload from '../utils/multerConfig';

const router = express.Router();

router.post('/', upload.single('image'), uploadImage);

export default router;
