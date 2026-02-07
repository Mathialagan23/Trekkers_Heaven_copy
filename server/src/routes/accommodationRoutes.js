import express from 'express';
import {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
} from '../controllers/accommodationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getAccommodations).post(protect, createAccommodation);
router.route('/:id').get(protect, getAccommodation).put(protect, updateAccommodation).delete(protect, deleteAccommodation);

export default router;

