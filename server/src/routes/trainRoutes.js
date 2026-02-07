import express from 'express';
import { protect } from '../middleware/auth.js';
import { getTrains, getTrain, createTrain, updateTrain, deleteTrain } from '../controllers/trainController.js';

const router = express.Router();

router.route('/').get(protect, getTrains).post(protect, createTrain);
router.route('/:id').get(protect, getTrain).put(protect, updateTrain).delete(protect, deleteTrain);

export default router;
