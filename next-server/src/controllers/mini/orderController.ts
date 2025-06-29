import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import { createWxPayUnifiedOrder } from "../../utils/wechatPay";

const prisma = new PrismaClient();
const redis = new Redis();

export const createOrder = async (req: Request, res: Response) => {
    const { openid, addressId } = req.body;
    if (!openid || !addressId) return res.status(400).json({ error: "缺少参数" });
    const redisKey = `cart:${openid}`;
    let cartList = await redis.get(redisKey);
    let cartArr = cartList ? JSON.parse(cartList) : [];
    if (!cartArr.length) return res.status(400).json({ error: "购物车为空" });
    // 查询用户信息
    const customer = await prisma.customers.findUnique({ where: { openid } });
    if (!customer) return res.status(400).json({ error: "用户不存在" });
    // 生成订单号
    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    // 计算总价
    let totalAmount = 0;
    const orderItemsData = await Promise.all(cartArr.map(async (item: any) => {
        const sku = await prisma.sku.findUnique({ where: { id: item.skuId } });
        if (!sku) throw new Error(`SKU不存在: ${item.skuId}`);
        const price = sku.retailPrice;
        const totalPrice = price * item.quantity;
        totalAmount += totalPrice;
        return {
            productId: sku.productId,
            skuId: item.skuId,
            quantity: item.quantity,
            price,
            totalPrice
        };
    }));
    // 创建订单及订单项
    const order = await prisma.order.create({
        data: {
            orderId,
            customerId: customer.id,
            openid,
            status: "UNPAID", // 待支付
            items: {
                create: orderItemsData
            }
        },
        include: { items: true }
    });
    // 清空购物车
    await redis.del(redisKey);
    // 调用微信支付统一下单
    const wxPayParams = await createWxPayUnifiedOrder({
        openid,
        out_trade_no: orderId,
        amount: Math.round(totalAmount * 100), // 单位分
        description: `商城订单-${orderId}`
    });
    // 返回订单及微信支付参数
    res.json({
        success: true,
        order,
        wxPayParams
    });
};

export const wxpayNotify = async (req: Request, res: Response) => {
    try {
        // 微信支付回调一般为 XML 格式，需要解析
        let xmlData = '';
        req.setEncoding('utf8');
        req.on('data', chunk => {
            xmlData += chunk;
        });
        req.on('end', async () => {
            // 解析 XML（需引入 xml2js 或 fast-xml-parser 等库）
            const parser = require('xml2js');
            parser.parseString(xmlData, async (err: any, result: any) => {
                if (err) {
                    return res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[XML解析失败]]></return_msg></xml>');
                }
                const notifyData = result.xml;
                const out_trade_no = notifyData.out_trade_no?.[0];
                const result_code = notifyData.result_code?.[0];
                // 校验签名（建议实际项目中实现）
                if (result_code === 'SUCCESS') {
                    // 更新订单状态
                    await prisma.order.update({
                        where: { orderId: out_trade_no },
                        data: { status: 'TO_BE_SHIPPED' }
                    });
                    return res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>');
                } else {
                    return res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>');
                }
            });
        });
    } catch (error) {
        return res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[服务器异常]]></return_msg></xml>');
    }
};