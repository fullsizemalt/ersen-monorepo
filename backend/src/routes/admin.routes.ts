import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { getUsers, getStats } from '../controllers/admin.controller';

const router = Router();

// Protect all admin routes
router.use(requireAuth);
router.use(requireAdmin);

router.get('/users', getUsers);
router.get('/stats', getStats);

export default router;
