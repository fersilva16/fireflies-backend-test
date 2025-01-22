import type { SummaryProvider } from '../summaryProvider/SummaryProvider';
import { SUMMARY_PROVIDER_ENUM } from '../summaryProvider/SummaryProviderEnum';

export const mockSummaryProvider: SummaryProvider = {
  name: SUMMARY_PROVIDER_ENUM.MOCK,

  summarize: ({ transcript }) => {
    const actionCount = Math.floor(Math.random() * 3) + 1;

    return {
      success: true,
      summary: transcript.slice(0, Math.floor(Math.random() * 10) + 10),
      actionItems: Array.from({ length: actionCount }, (_, i) => {
        return `Action item ${i + 1}`;
      }),
    };
  },
};
