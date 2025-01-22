import mongoose from 'mongoose';

import { config } from '../config';
import { logger } from '../logger';

export const mongooseConnect = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);

    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error(err, 'MongoDB connection error');
  }
};
