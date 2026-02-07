import Expense from '../models/Expense.js';

export const createAutoExpense = async ({ userId, itineraryId, amount, category, note }) => {
  if (!amount || Number(amount) <= 0) return null;
  const expense = await Expense.create({
    user: userId,
    itinerary: itineraryId,
    amount: Number(amount),
    category,
    note
  });
  return expense;
};
