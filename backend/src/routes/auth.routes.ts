import { Router } from 'express';
import { login, callback, me, logout, devLogin, cliLogin } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/me', requireAuth, me);
router.post('/logout', logout);
router.post('/dev-login', devLogin);
router.post('/cli-login', cliLogin);

export default router;
