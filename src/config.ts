import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: Number(process.env.PORT) || 3000,

  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/meetingbot',
};
