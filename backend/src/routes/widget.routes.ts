import { Router } from 'express';
import { getCatalog, getActiveWidgets, installWidget, uninstallWidget, updateWidget } from '../controllers/widget.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/catalog', getCatalog);
router.get('/active', requireAuth, getActiveWidgets);
router.post('/active', requireAuth, installWidget);
router.patch('/active/:id', requireAuth, updateWidget);
router.delete('/active/:id', requireAuth, uninstallWidget);

export default router;
