
import { Router } from 'express';
import { wxAuth, wxLogin, getUserInfo } from '../../controllers/mini/authController';

const router = Router();

router.post('/wxAuth', wxAuth);
router.post('/wxLogin', wxLogin);
router.get('/getUserInfo', getUserInfo);

export default router;