import type {
  SummarySummarizeArgs,
  SummarySummarizeResult,
} from './SummaryProviderSummarize';

export interface SummaryProvider {
  name: string;

  summarize(
    args: SummarySummarizeArgs,
  ): SummarySummarizeResult | Promise<SummarySummarizeResult>;
}
