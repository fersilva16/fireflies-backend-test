import { getEncoding } from 'js-tiktoken';

import { getOpenAIClient } from './openaiClient';
import type { SummaryProvider } from '../summaryProvider/SummaryProvider';
import { SUMMARY_PROVIDER_ENUM } from '../summaryProvider/SummaryProviderEnum';

const MAX_TOKENS = 100000;

const SUMMARIZE_PROMPT = `
You are a assistant that summarizes meeting transcripts.

Create a brief summary (up to 100 words) of the meeting transcript sent by the user below.

Also create a list of action items that the user can take to address the issues in the meeting:
- Start the list after '---'.
- Keep the list short and concise.
- Split the items by new lines.
`;

export const openaiSummaryProvider: SummaryProvider = {
  name: SUMMARY_PROVIDER_ENUM.OPENAI,

  summarize: async ({ transcript }) => {
    const openai = getOpenAIClient();

    // Using tiktoken to get a estimate of the number of tokens
    const encoder = getEncoding('gpt2');

    const tokens = encoder.encode(transcript);

    // Get the first 100k tokens to avoid breaking the API
    // IMPROVEMENT: Split the transcript into chunks and use the API to summarize each chunk iterating over summary and action items
    const safeTranscript = encoder.decode(tokens.slice(0, MAX_TOKENS));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SUMMARIZE_PROMPT.trim(),
        },
        {
          role: 'user',
          content: safeTranscript,
        },
      ],
    });

    if (!response.choices[0]?.message?.content) {
      return {
        success: false,
        message: 'Invalid response from OpenAI',
      };
    }

    const { content } = response.choices[0].message;

    const [summary, actions] = content.split('---');

    if (!summary || !actions) {
      return {
        success: false,
        message: 'Invalid response from OpenAI',
      };
    }

    const actionItems = actions
      .trim()
      .split('\n')
      .map((item) => item.trim());

    return {
      success: true,
      summary: summary.trim(),
      actionItems: actionItems,
    };
  },
};
