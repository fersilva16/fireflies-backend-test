import pino, { type LoggerOptions } from 'pino';
import { config } from './config';

const getDevelopmentOptions = (): LoggerOptions => {
  if (config.NODE_ENV !== 'development') {
    return {};
  }

  return {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  };
};

export const logger = pino({
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  ...getDevelopmentOptions(),
});
