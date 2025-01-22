import express from 'express';

import { authMiddleware } from './auth.middleware.js';
import { dashboardRoutes } from './dashboard/dashboardRoutes.js';
import { meetingRoutes } from './meeting/meetingRoutes.js';
import { config } from './config.js';
import { errorHandler } from './errorHandler.js';
import { mongooseConnect } from './mongoose/mongooseConnect.js';

const app = express();

await mongooseConnect();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MeetingBot API' });
});

app.use('/api/meetings', authMiddleware, meetingRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

app.use(errorHandler);

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console -- Add logger
  console.log(`Server is running on port ${config.PORT}`);
});
