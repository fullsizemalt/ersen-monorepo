import { Router } from 'express';
import { checkout, portal } from '../controllers/subscription.controller';
import { handleWebhook } from '../controllers/webhook.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import express from 'express';

const router = Router();

router.post('/checkout', requireAuth, express.json(), checkout);
router.post('/portal', requireAuth, portal);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
