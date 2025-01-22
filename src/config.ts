import dotenv from 'dotenv';

import { SUMMARY_PROVIDER_ENUM } from './modules/summaryProvider/SummaryProviderEnum';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: Number(process.env.PORT) || 3000,

  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/meetingbot',

  SUMMARY_PROVIDER: process.env.SUMMARY_PROVIDER || SUMMARY_PROVIDER_ENUM.MOCK,
};
