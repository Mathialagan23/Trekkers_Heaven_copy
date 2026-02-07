import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please provide bus company name']
  },
  departure: {
    from: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String }
  },
  arrival: {
    to: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String }
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
  }
}, {
  timestamps: true
});

const Bus = mongoose.model('Bus', busSchema);

export default Bus;
