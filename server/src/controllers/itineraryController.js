import Itinerary from '../models/Itinerary.js';
import { getTotalsForItinerary } from '../utils/budget.js';

export const getItineraries = async (req, res) => {
  try {
    let itineraries = await Itinerary.find({ user: req.user._id })
      .populate('flights')
      .populate('accommodations')
      .sort({ startDate: -1 });

    // attach totals for each itinerary
    itineraries = await Promise.all(itineraries.map(async (it) => {
      const totals = await getTotalsForItinerary(it._id);
      const itObj = it.toObject();
      itObj.totalSpent = totals.totalSpent;
      itObj.remainingBudget = totals.remainingBudget;
      itObj.budget = totals.budget;
      return itObj;
    }));

    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate('flights')
      .populate('accommodations');
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const totals = await getTotalsForItinerary(itinerary._id);
    const itObj = itinerary.toObject();
    itObj.totalSpent = totals.totalSpent;
    itObj.remainingBudget = totals.remainingBudget;
    itObj.budget = totals.budget;

    res.json(itObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.create({
      ...req.body,
      user: req.user._id
    });
    const populatedItinerary = await Itinerary.findById(itinerary._id)
      .populate('flights')
      .populate('accommodations');
    res.status(201).json(populatedItinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('flights').populate('accommodations');

    res.json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await itinerary.deleteOne();
    res.json({ message: 'Itinerary removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

