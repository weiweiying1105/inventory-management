import { Router } from "express";
import { getAllategory, createCategory, deleteCategory, updateCategory } from "../controllers/categoryController";
const router = Router()

router.get('/', getAllategory)
router.post('/', createCategory)
router.post('/delete', deleteCategory)
router.post('/update', updateCategory)
export default router