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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(notFound);
app.use(errorHandler);

export default app;

