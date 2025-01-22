import { app } from './app.js';
import { config } from './config.js';
import { logger } from './logger.js';
import { mongooseConnect } from './mongoose/mongooseConnect.js';

await mongooseConnect();

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});
