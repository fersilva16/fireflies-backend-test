import { app } from './app';
import { config } from './config';
import { logger } from './logger';
import { summaryProviderRegister } from './modules/summaryProvider/summaryProviderRegister';
import { mockSummaryProvider } from './modules/summaryProviderMock/MockSummaryProvider';
import { mongooseConnect } from './mongoose/mongooseConnect';

summaryProviderRegister(mockSummaryProvider);

await mongooseConnect();

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});
