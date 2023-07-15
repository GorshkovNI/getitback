import { Router } from 'express';
import { UserController } from '../controller/user.controller';

const router = Router();

router.post('/createUser', UserController.createUser);
router.get('/refresh', UserController.refresh);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);

export default router;