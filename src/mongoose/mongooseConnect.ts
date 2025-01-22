import mongoose from 'mongoose';
import { config } from '../config';

export const mongooseConnect = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);

    // eslint-disable-next-line no-console -- Add logger
    console.log('Connected to MongoDB');
  } catch (err) {
    // eslint-disable-next-line no-console -- Add logger
    console.error('MongoDB connection error:', err);
  }
};
