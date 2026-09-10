export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  failed?: boolean;
  errorText?: string;
}
