import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

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

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors({
  origin: [
    "https://strong-shelter-486415-c8.web.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// IMPORTANT: handle preflight
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
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


app.use(express.static(path.join(__dirname, '../public')));

// React/Vite fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.use(notFound);
app.use(errorHandler);

export default app;
