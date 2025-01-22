import type { SummaryProvider } from './SummaryProvider';
import { config } from '../../config';

const providers: Record<string, SummaryProvider> = {};

export const summaryProviderRegister = (provider: SummaryProvider) => {
  providers[provider.name] = provider;
};

export const summaryProviderGet = () => {
  const provider = providers[config.SUMMARY_PROVIDER];

  if (!provider) {
    throw new Error('Invalid provider');
  }

  return provider;
};
