import express from 'express';
import {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight
} from '../controllers/flightController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getFlights).post(protect, createFlight);
router.route('/:id').get(protect, getFlight).put(protect, updateFlight).delete(protect, deleteFlight);

export default router;

