import { forwardRef } from 'react';
import { AssistantCoinIcon } from './assistant-coin-icon';

interface ChatbotLauncherProps {
  hasNotification: boolean;
  onClick: () => void;
}

export const ChatbotLauncher = forwardRef<HTMLButtonElement, ChatbotLauncherProps>(
  function ChatbotLauncher({ hasNotification, onClick }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className="chatbot-launcher"
        aria-label="Abrir Asistente Vida"
        onClick={onClick}
      >
        <AssistantCoinIcon className="chatbot-launcher-icon" />
        {hasNotification && (
          <span className="chatbot-notification" aria-label="Hay una respuesta nueva" />
        )}
      </button>
    );
  },
);
