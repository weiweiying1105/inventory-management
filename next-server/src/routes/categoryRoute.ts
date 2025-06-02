import { Router } from "express";
import { getAllCategories, createCategory, deleteCategory, updateCategory } from "../controllers/categoryController";
const router = Router()

router.get('/', getAllCategories)
router.post('/', createCategory)
router.post('/delete', deleteCategory)
router.post('/update', updateCategory)
export default router