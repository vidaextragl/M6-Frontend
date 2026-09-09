import { forwardRef } from 'react';
import type { ChatMessage } from './chatbot.types';

interface ChatbotMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onRetry: (message: ChatMessage) => void;
  onSuggestion: (message: string) => void;
}

const suggestions = [
  'Consultar mi saldo',
  'Explicar el cashback',
  'Cambiar monedas',
];

export const ChatbotMessages = forwardRef<HTMLDivElement, ChatbotMessagesProps>(
  function ChatbotMessages({ messages, isTyping, onRetry, onSuggestion }, ref) {
    return (
      <div ref={ref} className="chatbot-messages" aria-live="polite" aria-busy={isTyping}>
        <div className="chatbot-message chatbot-message-assistant">
          Hola, ¿en qué puedo ayudarte?
        </div>

        {messages.length === 0 && (
          <div className="chatbot-suggestions" aria-label="Preguntas sugeridas">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestion(suggestion)}
                disabled={isTyping}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`chatbot-message-group chatbot-message-group-${message.role}`}>
            <div className={`chatbot-message chatbot-message-${message.role}`}>
              {message.content}
            </div>
            {message.failed && (
              <div className="chatbot-message-error" role="alert">
                <span>{message.errorText ?? 'No se pudo enviar.'}</span>
                <button type="button" onClick={() => onRetry(message)} disabled={isTyping}>
                  Reintentar
                </button>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="chatbot-typing" role="status">
            <span>La IA está escribiendo</span>
            <span className="chatbot-typing-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
      </div>
    );
  },
);
