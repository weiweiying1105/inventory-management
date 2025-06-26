import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { pickValidFields } from "../../utils/pickValidFields";

const prisma = new PrismaClient();

// 公共的获取用户信息逻辑
const fetchUserByOpenid = async (openid: string) => {
  const user = await prisma.customers.findUnique({
    where: {
      openid
    }
  })
  return user;
}

export const getCustomerInfo = async (req: Request, res: Response) => {
  const { openid } = req.headers;
  try {
    if (!openid) return res.status(400).json({ error: "openid不能为空" });
    const user = await fetchUserByOpenid(openid as string);
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

// 获取我的页面信息,返回userInfo, countsData, orderTagInfos: orderInfo, customerServiceInfo 
export const getUserCenter = async (req: Request, res: Response) => {
  const { openid } = req.headers;
  try {
    const userInfo = await fetchUserByOpenid(openid as string);
    res.json({
      code: 200,
      message: "成功",
      data: {
        userInfo, countsData: [], orderTagInfos: null, customerServiceInfo: null
      }
    })

  } catch (error) {
    res.status(500).json({ error: "获取用户信息失败", message: error })
  }
}