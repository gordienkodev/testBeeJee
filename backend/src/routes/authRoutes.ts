
import { Router } from 'express';
import { login, logout, getMe } from '../controllers/authController';

const router: Router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;
