import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        // 查出所有品类
        const categories = await prisma.category.findMany();
        // 构建树形结构
        const map = new Map();
        const roots: any[] = []
        categories.forEach((cat: any) => {
            map.set(cat.id, { ...cat, children: [] });
        })
        categories.forEach((cat: any) => {
            if (cat.parentId) {
                map.get(cat.parentId).children.push(map.get(cat.id));
            } else {
                roots.push(map.get(cat.id));
            }
        })
        res.json({ code: 200, message: '获取成功', data: roots });
    } catch (error) {
        res.status(500).json({ code: 500, message: '获取失败', error });
    }
};