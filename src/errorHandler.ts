import { Request, Response } from 'express';

export const errorHandler = (err: unknown, req: Request, res: Response) => {
  // eslint-disable-next-line no-console -- Add logger
  console.error(err);

  res.status(500).json({ message: 'Internal Server Error' });
};
