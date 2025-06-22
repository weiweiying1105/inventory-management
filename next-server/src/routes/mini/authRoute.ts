
import { Router } from 'express';
import { wxAuth, wxLogin } from '../../controllers/mini/authController';

const router = Router();

router.post('/wxAuth', wxAuth);
router.post('/wxLogin', wxLogin);


export default router;