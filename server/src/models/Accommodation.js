import mongoose from 'mongoose';

const accommodationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide accommodation name']
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
  },
  notes: {
    type: String,
    default: ''
  },
  hostelworldId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

export default Accommodation;

