import {Router} from "express";
import {AdController} from "../controller/ad.controller";


const router = Router()

router.post('/addItem', AdController.addItem);

export default router