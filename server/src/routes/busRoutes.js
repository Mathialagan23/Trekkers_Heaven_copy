import express from 'express';
import { protect } from '../middleware/auth.js';
import { getBuses, getBus, createBus, updateBus, deleteBus } from '../controllers/busController.js';

const router = express.Router();

router.route('/').get(protect, getBuses).post(protect, createBus);
router.route('/:id').get(protect, getBus).put(protect, updateBus).delete(protect, deleteBus);

export default router;
