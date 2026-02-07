import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createExpense,
  getExpensesByItinerary,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', protect, createExpense);
router.get('/:itineraryId', protect, getExpensesByItinerary);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

export default router;
