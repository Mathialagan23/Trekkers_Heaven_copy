import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  airline: {
    type: String,
    required: [true, 'Please provide airline name']
  },
  departure: {
    airport: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  arrival: {
    airport: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    }
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
  skyscannerId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;

