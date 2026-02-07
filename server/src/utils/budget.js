// import Expense from '../models/Expense.js';
// import Itinerary from '../models/Itinerary.js';

// export const getTotalsForItinerary = async (itineraryId) => {
//   const result = await Expense.aggregate([
//     { $match: { itinerary: itineraryId } },
//     { $group: { _id: null, total: { $sum: '$amount' } } }
//   ]);

//   const totalSpent = (result[0] && result[0].total) ? result[0].total : 0;
//   const itinerary = await Itinerary.findById(itineraryId).select('budget');
//   const budget = itinerary ? (itinerary.budget || 0) : 0;
//   const remainingBudget = budget - totalSpent;

//   return { totalSpent, budget, remainingBudget };
// };

import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import Itinerary from '../models/Itinerary.js';

export const getTotalsForItinerary = async (itineraryId) => {
  const result = await Expense.aggregate([
    {
      $match: {
        itinerary: new mongoose.Types.ObjectId(itineraryId)
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const totalSpent = result[0]?.total || 0;

  const itinerary = await Itinerary.findById(itineraryId).select('budget');
  const budget = itinerary?.budget || 0;

  return {
    totalSpent,
    budget,
    remainingBudget: budget - totalSpent
  };
};

