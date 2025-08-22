import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();
const redis = new Redis();

// 获取购物车列表
export const getCart = async (req: Request, res: Response) => {
  const { openid } = req.headers;
  if (!openid) return res.status(400).json({ error: "缺少 openid" });
  const redisKey = `cart:${openid}`;
try{
  // 1. 优先从Redis缓存中获取
  let cartList = await redis.get(redisKey);
  if (cartList) {
    const cachedData = JSON.parse(cartList);
    return res.json({
      ...cachedData,
      requestId: mockReqId(),
      clientIp: mockIp(),
      rt: Date.now() - startTime
    });
  }

}catch(error){

}

  // 2. Redis中没有数据，从数据库查询
  const cart = await prisma.cart.findMany({
    where: { openid: openid as string },
    include: { sku: true }
  });

  // 3. 将数据库查询结果存入Redis缓存，设置3天过期时间
  await redis.set(redisKey, JSON.stringify(cart), "EX", 3 * 24 * 60 * 60);

  // 4. 返回数据库查询结果
  res.json(cart);
};

// 添加/更新购物车（优先操作 Redis，三天有效期）
export const addToCart = async (req: Request, res: Response) => {
  const { openid } = req.headers;
  const { skuId, quantity } = req.body;
  // 校验参数
  if (!openid || !skuId) return res.status(400).json({ error: "缺少参数" });
  const redisKey = `cart:${openid}`;
  // 从 Redis 获取当前用户的购物车列表
  let cartList = await redis.get(redisKey);
  let cartArr = cartList ? JSON.parse(cartList) : [];
  let found = false;
  // 遍历购物车，查找是否已存在该 SKU
  for (let item of cartArr) {
    if (item.skuId === skuId) {
      item.quantity += quantity || 1;
      found = true;
      // 查询并补充 productId
      if (!item.productId) {
        const sku = await prisma.sku.findUnique({ where: { id: skuId }, select: { productId: true } });
        if (sku) item.productId = sku.productId;
      }
      break;
    }
  }
  // 如果购物车中没有该 SKU，则新增一条记录
  if (!found) {
    // 查询 productId
    const sku = await prisma.sku.findUnique({ where: { id: skuId }, select: { productId: true } });
    cartArr.push({ skuId, quantity: quantity || 1, productId: sku ? sku.productId : undefined });
  }
  // 更新 Redis，设置三天过期
  await redis.set(redisKey, JSON.stringify(cartArr), "EX", 3 * 24 * 60 * 60);
  res.json({ success: true, cart: cartArr });
};

// 修改购物车商品数量
export const updateCart = async (req: Request, res: Response) => {
  const { openid, skuId, quantity } = req.body;
  if (!openid || !skuId || typeof quantity !== "number") return res.status(400).json({ error: "缺少参数" });
  const redisKey = `cart:${openid}`;
  let cartList = await redis.get(redisKey);
  let cartArr = cartList ? JSON.parse(cartList) : [];
  for (let item of cartArr) {
    if (item.skuId === skuId) {
      item.quantity = quantity;
      break;
    }
  }
  await redis.set(redisKey, JSON.stringify(cartArr), "EX", 3 * 24 * 60 * 60);
  res.json({ success: true, cart: cartArr });
};

// 删除购物车商品
export const removeFromCart = async (req: Request, res: Response) => {
  const { openid, skuId } = req.body;
  if (!openid || !skuId) return res.status(400).json({ error: "缺少参数" });
  const redisKey = `cart:${openid}`;
  let cartList = await redis.get(redisKey);
  let cartArr = cartList ? JSON.parse(cartList) : [];
  cartArr = cartArr.filter((item: any) => item.skuId !== skuId);
  await redis.set(redisKey, JSON.stringify(cartArr), "EX", 3 * 24 * 60 * 60);
  res.json({ success: true, cart: cartArr });
};