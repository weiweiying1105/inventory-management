import { Router } from "express";
import categoryRoute from "./categoryRoute";
import productRoute from "./productRoute";
import cartRoute from "./cartRoute";
import orderRoute from "./orderRoute";

const router = Router();

router.use(categoryRoute);
router.use(productRoute);
router.use(cartRoute);
router.use(orderRoute);

export default router;