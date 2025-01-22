import OpenAI from 'openai';

import { config } from '../../config';

let openai: OpenAI | undefined = undefined;

export const getOpenAIClient = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });
  }

  return openai;
};
