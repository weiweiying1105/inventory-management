import { Router } from 'express'
import { getAllCategories } from '../../controllers/categoryController'

const router = Router()
router.get('/categories', getAllCategories)

export default router