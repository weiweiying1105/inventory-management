import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";

import axios from "axios";

const prisma = new PrismaClient();
const APPID = process.env.MINIAPP_APPID;
const SECRET = process.env.MINIAPP_SECRET;

// 定义一个异步函数，用于处理用户登录请求
export const wxLogin = async (req: Request, res: Response) => {
  try {
    // 从请求中获取code参数
    const { code } = req.body;
    console.log('code', code, res)
    // 调用微信接口获取openid
    const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`);
    console.log('WeChat API response:', response.data);


    // 从响应中获取openid和session_key
    const { openid, session_key } = response.data;

    // 将openid和session_key保存到数据库中
    let customer = await prisma.customers.findUnique({
      where: {
        openid
      },
    });
    console.log('customer', customer)
    if (!customer) {
      customer = await prisma.customers.create({
        data: { openid, session_key }
      });
    } else {
      customer = await prisma.customers.update({
        where: {
          openid: customer.openid
        },
        data: {
          lastLoginAt: new Date()
        }
      })
    }

    res.json({
      code: 200,
      message: "登录成功",
      data: {
        customerId: customer.id,
        openid: customer.openid,
        session_key: session_key,
      },
    });
  } catch (error) {
    // 如果发生错误，返回500状态码和错误信息
    res.status(500).json({ error: "登录失败", message: error });
  }
}

// 授权头像和手机号
export const wxAuth = async (req: Request, res: Response) => {
  try {
    const { openid, userInfo, phoneInfo } = req.body;
    if (!openid) {
      return res.status(401).json({ error: "用户未登录" });
    }

    // 更新用户信息
    const customerRecord = await prisma.customers.findUnique({ where: { openid } });
    if (!customerRecord) {
      return res.status(404).json({ error: "用户不存在" });
    }
    const customer = await prisma.customers.update({
      where: { id: customerRecord.id },
      data: {
        nickName: userInfo?.nickName,
        avatarUrl: userInfo?.avatarUrl,
        gender: userInfo?.gender,
        country: userInfo?.country,
        province: userInfo?.province,
        city: userInfo?.city,
        phone: phoneInfo?.phoneNumber,
        updatedAt: new Date()
      }
    });
    res.json({
      code: 200,
      message: "授权成功",
      data: {
        customerId: customer.id,
        openid: customer.openid,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "授权失败", message: error });
  }
}

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: "获取用户信息成功",
      data: {
        userInfo: null, countsData: null, orderTagInfos: null, customerServiceInfo: null
      }
    })
  } catch (error) {
    res.status(500).json({ error: "获取用户信息失败", message: error });
  }
}