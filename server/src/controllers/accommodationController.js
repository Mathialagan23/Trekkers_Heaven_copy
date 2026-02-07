import Accommodation from '../models/Accommodation.js';
import Itinerary from '../models/Itinerary.js';
import { createAutoExpense } from '../utils/autoExpense.js';
import { getTotalsForItinerary } from '../utils/budget.js';

export const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({ user: req.user._id }).sort({ checkIn: -1 });
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    if (accommodation.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAccommodation = async (req, res) => {
  try {
    const { itinerary: itineraryId, price } = req.body;

    if (!itineraryId) return res.status(400).json({ message: 'Itinerary is required' });

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const accommodation = await Accommodation.create({
      ...req.body,
      user: req.user._id,
      itinerary: itineraryId
    });

    // auto-create expense for the accommodation
    if (price && Number(price) > 0) {
      await createAutoExpense({
        userId: req.user._id,
        itineraryId,
        amount: Number(price),
        category: 'Stay',
        note: `Auto: Accommodation - ${accommodation.name || ''}`
      });
    }

    const totals = await getTotalsForItinerary(itineraryId);
    res.status(201).json({ accommodation, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    if (accommodation.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedAccommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    if (accommodation.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await accommodation.deleteOne();
    res.json({ message: 'Accommodation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

