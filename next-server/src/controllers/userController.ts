import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || ''

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await prisma.users.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(500).json({ error: '用户不存在' });
    }
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('isValidPassword', isValidPassword, typeof isValidPassword)
    if (!isValidPassword) {
      return res.status(500).json({ error: '密码错误' });
    }
    // 生成 JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '24h'
    });
    console.log('token', token)

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: '登录错误', message: error })
  }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;


    // 检查邮箱是否已存在
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(500).json({ error: 'Email already exists' });
    }
    // 加密密码
    const salt = await bcrypt.genSalt(10);// 生成随机的盐值，10是加密的轮数，轮数越多，加密越慢，安全性越高
    const hashPassword = await bcrypt.hash(password, salt); // 使用盐值对密码进行哈希加密

    // 创建新用户
    const user = await prisma.users.create({
      data: {
        email,
        password: hashPassword, // 存储加密后的哈希密码
      },
    });

    // 生成 JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: '注册错误', error });
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await prisma.users.findMany()
    res.status(200).json({
      users: user
    })
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' })
  }
}