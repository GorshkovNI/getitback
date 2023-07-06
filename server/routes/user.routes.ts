import { Router } from 'express';
import { UserController } from '../controller/user.controller';

const router = Router();

router.post('/createUser', UserController.createUser);

export default router;