import Bus from '../models/Bus.js';
import Itinerary from '../models/Itinerary.js';
import { createAutoExpense } from '../utils/autoExpense.js';
import { getTotalsForItinerary } from '../utils/budget.js';

export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ user: req.user._id }).sort({ 'departure.date': -1 });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    if (bus.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBus = async (req, res) => {
  try {
    const { itinerary: itineraryId, price } = req.body;

    if (!itineraryId) return res.status(400).json({ message: 'Itinerary is required' });

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const bus = await Bus.create({
      ...req.body,
      user: req.user._id,
      itinerary: itineraryId
    });

    // auto-create expense for the bus
    if (price && Number(price) > 0) {
      await createAutoExpense({
        userId: req.user._id,
        itineraryId,
        amount: Number(price),
        category: 'Travel',
        note: `Auto: Bus - ${bus.company || ''}`
      });
    }

    const totals = await getTotalsForItinerary(itineraryId);
    res.status(201).json({ bus, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    if (bus.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    if (bus.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    await bus.deleteOne();
    res.json({ message: 'Bus removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
