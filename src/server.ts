import express from 'express';
import mongoose from 'mongoose';

import { authMiddleware } from './auth.middleware.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { meetingRoutes } from './routes/meetings.js';

const { PORT = 3000, MONGODB_URI = 'mongodb://localhost:27017/meetingbot' } =
  process.env;

const app = express();

await mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // eslint-disable-next-line no-console -- Add logger
    console.log('Connected to MongoDB');
  })
  .catch((err: unknown) => {
    // eslint-disable-next-line no-console -- Add logger
    console.error('MongoDB connection error:', err);
  });

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MeetingBot API' });
});

app.use('/api/meetings', authMiddleware, meetingRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console -- Add logger
  console.log(`Server is running on port ${PORT}`);
});
