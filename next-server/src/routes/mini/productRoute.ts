import { Router } from "express";
const { getProducts, getProductDetail } = require("../../controllers/mini/productController");

const router = Router();

/**
 * GET /mini/products
 * 查询产品列表
 * 可选参数：
 *   - categoryId: 分类ID，筛选指定分类下产品
 *   - keyword: 关键字，按产品名称模糊搜索
 *   - page: 页码，默认1
 *   - pageSize: 每页数量，默认20
 */
router.get("/products", getProducts);
router.get("/product/detail", getProductDetail);

export default router;