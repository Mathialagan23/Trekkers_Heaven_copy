import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide itinerary title']
  },
  description: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  flights: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  }],
  accommodations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation'
  }],
  budget: {
    type: Number,
    required: [true, 'Please provide itinerary budget'],
    min: [0, 'Budget cannot be negative']
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

export default Itinerary;

