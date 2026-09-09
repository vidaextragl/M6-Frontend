import { apiFetch } from './api-client';

export interface ChatbotResponse {
  reply: string;
}

export const chatbotApi = {
  sendMessage(message: string, signal?: AbortSignal): Promise<ChatbotResponse> {
    return apiFetch<ChatbotResponse>('/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal,
    });
  },
};
