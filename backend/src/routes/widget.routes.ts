import { Router } from 'express';
import { getCatalog, getActiveWidgets, installWidget, uninstallWidget, updateWidget } from '../controllers/widget.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { installWidgetSchema, updateWidgetSchema, widgetIdParamSchema } from '../validations/widget.schema';

const router = Router();

router.get('/catalog', getCatalog);
router.get('/active', requireAuth, getActiveWidgets);
router.post('/active', requireAuth, validateBody(installWidgetSchema), installWidget);
router.patch('/active/:id', requireAuth, validateParams(widgetIdParamSchema), validateBody(updateWidgetSchema), updateWidget);
router.delete('/active/:id', requireAuth, validateParams(widgetIdParamSchema), uninstallWidget);

export default router;
