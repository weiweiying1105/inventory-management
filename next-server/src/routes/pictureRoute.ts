import { Router } from "express";
import { getAllPictures } from "../controllers/pictureController";

const router = Router()

router.get('/list', getAllPictures)

export default router