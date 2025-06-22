import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { pickValidFields } from "../../utils/pickValidFields";
const prisma = new PrismaClient();

export const getCustomerInfo = async (req: Request, res: Response) => {
    const { openid } = req.params;
    try {
        const user = await prisma.customers.findUnique({
            where: {
                openid
            }
        })
        res.json({
            code: 200,
            message: "获取用户信息成功",
            data: {
                userInfo: user, countsData: null, orderTagInfos: null, customerServiceInfo: null
            }
        })
    } catch (error) {
        res.status(500).json({ error: "获取用户信息失败", message: error });
    }
}

export const updateCustomerInfo = async (req: Request, res: Response) => {
    const { openid, ...rest } = req.body;
    if (!openid) return res.status(400).json({ error: "openid不能为空" });
    const update = pickValidFields(rest);
    try {
        const user = await prisma.customers.update({
            where: {
                openid
            },
            data: update
        })
        res.status(200).json({
            code: 200,
            message: "更新用户信息成功",
            data: user
        })
    } catch (error) {
    }
}