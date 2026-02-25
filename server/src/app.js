import express from 'express';
import cors from 'cors';

import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import accommodationRoutes from './routes/accommodationRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import busRoutes from './routes/busRoutes.js';
import trainRoutes from './routes/trainRoutes.js';

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────
// Single config object used for BOTH middleware and preflight handler
const corsOptions = {
  origin: [
    'https://strong-shelter-486415-c8.web.app',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Handle OPTIONS preflight FIRST (before any body-parsing)
app.options('*', cors(corsOptions));

// Apply CORS to all subsequent requests
app.use(cors(corsOptions));

// ─── Body parsing ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API routes ──────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/trains', trainRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ─── Error handling ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;

