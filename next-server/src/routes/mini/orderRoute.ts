import { Router } from "express";
import { createOrder, wxpayNotify } from "../../controllers/mini/orderController";

const router = Router();

// 创建订单并支付
router.post("/order", createOrder);
// 微信支付回调通知
router.post("/wxpay/notify", wxpayNotify);

export default router;