import { Router } from 'express';
import { customRateLimiter } from '../middleware/rateLimiter';
import { getDataLogs, seedDataLogs } from '../controllers/dataLogController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Rate Limiter
router.use(customRateLimiter);

// Routes
router.get('/', asyncHandler(getDataLogs));
router.post('/seed', asyncHandler(seedDataLogs));

export default router;