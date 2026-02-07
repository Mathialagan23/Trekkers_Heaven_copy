import express from 'express';
import {
  getItineraries,
  getItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getItineraries).post(protect, createItinerary);
router.route('/:id').get(protect, getItinerary).put(protect, updateItinerary).delete(protect, deleteItinerary);

export default router;

