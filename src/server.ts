import { app } from './app';
import { config } from './config';
import { logger } from './logger';
import { summaryProviderRegister } from './modules/summaryProvider/summaryProviderRegister';
import { mockSummaryProvider } from './modules/summaryProviderMock/MockSummaryProvider';
import { openaiSummaryProvider } from './modules/summaryProviderOpenai/OpenaiSummaryProvider';
import { mongooseConnect } from './mongoose/mongooseConnect';

summaryProviderRegister(mockSummaryProvider);
summaryProviderRegister(openaiSummaryProvider);

await mongooseConnect();

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});
