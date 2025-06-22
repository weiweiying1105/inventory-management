import { Router } from "express";
import { getProducts } from "../../controllers/mini/productController";

const router = Router();

router.get("/products", getProducts);

export default router;