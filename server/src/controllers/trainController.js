import TrainJourney from '../models/TrainJourney.js';
import Itinerary from '../models/Itinerary.js';
import { createAutoExpense } from '../utils/autoExpense.js';
import { getTotalsForItinerary } from '../utils/budget.js';

export const getTrains = async (req, res) => {
  try {
    const trains = await TrainJourney.find({ user: req.user._id }).sort({ 'departure.date': -1 });
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrain = async (req, res) => {
  try {
    const train = await TrainJourney.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train journey not found' });
    if (train.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    res.json(train);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTrain = async (req, res) => {
  try {
    const { itinerary: itineraryId, price } = req.body;

    if (!itineraryId) return res.status(400).json({ message: 'Itinerary is required' });

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const train = await TrainJourney.create({
      ...req.body,
      user: req.user._id,
      itinerary: itineraryId
    });

    // auto-create expense for the train
    if (price && Number(price) > 0) {
      await createAutoExpense({
        userId: req.user._id,
        itineraryId,
        amount: Number(price),
        category: 'Travel',
        note: `Auto: Train - ${train.operator || ''}`
      });
    }

    const totals = await getTotalsForItinerary(itineraryId);
    res.status(201).json({ train, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrain = async (req, res) => {
  try {
    const train = await TrainJourney.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train journey not found' });
    if (train.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const updated = await TrainJourney.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrain = async (req, res) => {
  try {
    const train = await TrainJourney.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train journey not found' });
    if (train.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    await train.deleteOne();
    res.json({ message: 'Train removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};