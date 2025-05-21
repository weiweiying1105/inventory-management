import { Router } from "express";
import { getAllPictures, addAllPictures } from "../controllers/pictureController";

const router = Router()

router.get('/list', getAllPictures)

router.post('/add', addAllPictures)

export default router