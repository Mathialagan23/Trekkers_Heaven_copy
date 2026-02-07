import Flight from '../models/Flight.js';
import Itinerary from '../models/Itinerary.js';
import { createAutoExpense } from '../utils/autoExpense.js';
import { getTotalsForItinerary } from '../utils/budget.js';

export const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find({ user: req.user._id }).sort({ 'departure.date': -1 });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFlight = async (req, res) => {
  try {
    const { itinerary: itineraryId, price } = req.body;

    if (!itineraryId) return res.status(400).json({ message: 'Itinerary is required' });

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const flight = await Flight.create({
      ...req.body,
      user: req.user._id,
      itinerary: itineraryId
    });

    // auto-create expense for the flight
    if (price && Number(price) > 0) {
      await createAutoExpense({
        userId: req.user._id,
        itineraryId,
        amount: Number(price),
        category: 'Travel',
        note: `Auto: Flight - ${flight.airline || ''}`
      });
    }

    const totals = await getTotalsForItinerary(itineraryId);
    res.status(201).json({ flight, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedFlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await flight.deleteOne();
    res.json({ message: 'Flight removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

