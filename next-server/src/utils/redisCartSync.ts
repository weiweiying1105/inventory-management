import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

const redis = new Redis();
const prisma = new PrismaClient();

/**
 * 定时扫描 Redis 中的 cart:* key，将数据同步到 Cart 表
 * 建议每小时或每天定时调用
 */
export async function syncRedisCartToDB() {
  // 获取所有 cart:* key
  const keys = await redis.keys("cart:*");
  for (const key of keys) {
    const cartList = await redis.get(key);
    if (!cartList) continue;
    let cartArr: any[] = [];
    try {
      cartArr = JSON.parse(cartList);
    } catch (e) {
      continue;
    }
    // 解析 openid
    const openid = key.replace("cart:", "");
    // 先删除该用户在 Cart 表的所有记录，避免重复
    await prisma.cart.deleteMany({ where: { openid } });
    // 批量插入新数据
    if (cartArr.length > 0) {
      await prisma.cart.createMany({ data: cartArr });
    }
  }
}

// 可选：定时任务示例（如用 node-cron 或 setInterval 调用）
// setInterval(syncRedisCartToDB, 60 * 60 * 1000); // 每小时同步一次