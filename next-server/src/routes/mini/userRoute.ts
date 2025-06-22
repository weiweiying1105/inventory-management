import { Router } from "express";
import { getCustomerInfo, updateCustomerInfo } from "../../controllers/mini/userController";

const router = Router();

router.get('/getUserInfo', getCustomerInfo);
router.post('/updateUserInfo', updateCustomerInfo);

export default router;