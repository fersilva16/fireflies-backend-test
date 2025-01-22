export interface SummarySummarizeArgs {
  transcript: string;
}

export interface SummarySummarizeSuccess {
  success: true;
  summary: string;
  actionItems: string[];
}

export interface SummarySummarizeError {
  success: false;
  message: string;
}

export type SummarySummarizeResult =
  | SummarySummarizeSuccess
  | SummarySummarizeError;
