import {Router} from "express";
import {CategoryController} from "../controller/category.controller";


const router = Router()

router.post('/categories', CategoryController.createCategory);
router.post('/subcategories', CategoryController.createSubcategory);
router.post('/custom-field', CategoryController.createCustomField);
router.get('/getCategory', CategoryController.getCategory);

export default router;