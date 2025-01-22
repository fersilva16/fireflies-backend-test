import { app } from './app';
import { config } from './config';
import { logger } from './logger';
import { mongooseConnect } from './mongoose/mongooseConnect';

await mongooseConnect();

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});
