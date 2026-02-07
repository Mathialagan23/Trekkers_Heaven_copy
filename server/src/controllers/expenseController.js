import Expense from '../models/Expense.js';
import Itinerary from '../models/Itinerary.js';
import { getTotalsForItinerary } from '../utils/budget.js';

export const createExpense = async (req, res) => {
  try {
    const { itinerary: itineraryId, amount, category, date, note } = req.body;

    if (!itineraryId) return res.status(400).json({ message: 'Itinerary is required' });

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      itinerary: itineraryId,
      amount,
      category,
      date,
      note
    });

    const totals = await getTotalsForItinerary(itineraryId);
    res.status(201).json({ expense, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpensesByItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const expenses = await Expense.find({ itinerary: itineraryId }).sort({ date: -1 });
    const totals = await getTotalsForItinerary(itineraryId);
    res.json({ expenses, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updates = req.body;
    const updated = await Expense.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    const totals = await getTotalsForItinerary(updated.itinerary);

    res.json({ expense: updated, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const itineraryId = expense.itinerary;
    await expense.deleteOne();
    const totals = await getTotalsForItinerary(itineraryId);
    res.json({ message: 'Expense removed', totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
