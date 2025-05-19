import express from 'express';
import { uploadImage } from '../controllers/uploadController';
import upload from '../utils/multerConfig';

const router = express.Router();

router.post('/', upload.single('image'), uploadImage);  // Changed 'file' to 'image'

export default router;
