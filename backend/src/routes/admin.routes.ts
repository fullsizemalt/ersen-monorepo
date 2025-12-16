import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { getUsers, getStats, getCoupons, createCouponEndpoint, deleteCouponEndpoint, applyCouponEndpoint } from '../controllers/admin.controller';

const router = Router();

// Protect all admin routes
router.use(requireAuth);
router.use(requireAdmin);

router.get('/users', getUsers);
router.get('/stats', getStats);

// Promotions
router.get('/coupons', getCoupons);
router.post('/coupons', createCouponEndpoint);
router.delete('/coupons/:id', deleteCouponEndpoint);
router.post('/users/:userId/apply-coupon', applyCouponEndpoint);

export default router;
