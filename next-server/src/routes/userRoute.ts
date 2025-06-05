/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 用户管理
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 获取所有用户
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 成功返回用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role:
 *                     type: string
 */

import { Router } from "express";
import { getUsers } from "../controllers/userController";

const route = Router();

route.get('/', getUsers)


export default route;