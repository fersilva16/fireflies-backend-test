import { type Request, type Response } from 'express';

import { logger } from './logger';

export const errorHandler = (err: unknown, _: Request, res: Response) => {
  logger.error(err, 'API Error');

  res.status(500).json({ message: 'Internal Server Error' });
};
