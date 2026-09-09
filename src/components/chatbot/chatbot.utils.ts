export function normalizeChatMessage(value: string): string {
  return value.trim().slice(0, 500);
}

export function readChatbotReply(response: unknown): string | null {
  if (!response || typeof response !== 'object' || !('reply' in response)) {
    return null;
  }

  const { reply } = response as { reply?: unknown };
  if (typeof reply !== 'string' || reply.trim().length === 0) {
    return null;
  }

  return reply.trim();
}
