import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { page = 1, pageSize = 20, categoryId } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const take = Number(pageSize);
        const where: any = {};
        if (categoryId) {
            where.categoryId = Number(categoryId); // 保证类型一致
        }

        const [products, total] = await Promise.all([
            prisma.products.findMany({
                where,
                skip,
                take,
                orderBy: {
                    productId: 'desc'
                }
            }),
            prisma.products.count({
                where
            })
        ])

        res.status(200).json({
            data: products,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        })
    } catch (error) {
        res.status(500).json({ error: '服务器错误', detail: error });
    }
}