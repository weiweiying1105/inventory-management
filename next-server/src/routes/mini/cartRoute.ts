import { Router } from "express";
import { getCart, addToCart, updateCart, removeFromCart } from "../../controllers/mini/cartController";

const router = Router();

router.get("/cart", getCart); // 查询购物车
router.post("/cart", addToCart); // 添加/更新购物车
router.put("/cart", updateCart); // 修改数量
router.delete("/cart", removeFromCart); // 删除商品

export default router;