import express from 'express';
import { getHomeData } from '../../controllers/mini/homeController';

const router = express.Router();

router.get('/home', getHomeData);

export default router;