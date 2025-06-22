import { Router } from 'express'
import { getAllCategory } from '../../controllers/mini/categoryController'


const router = Router()
router.get('/categories', getAllCategory)


export default router