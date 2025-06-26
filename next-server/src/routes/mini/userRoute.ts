import { Router } from "express";
import { getCustomerInfo, updateCustomerInfo, getUserCenter } from "../../controllers/mini/userController";
import openidMiddleware from "../../middleware/openidMiddleware";

const router = Router();

router.get('/getUserInfo', openidMiddleware, getCustomerInfo);
router.post('/updateUserInfo', openidMiddleware, updateCustomerInfo);
router.get('/getUserCenter', openidMiddleware, getUserCenter); // 获取用户中心信息

export default router;