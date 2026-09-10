import { AssistantCoinIcon } from './assistant-coin-icon';

interface ChatbotHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  onNewConversation: () => void;
}

export function ChatbotHeader({
  onClose,
  onMinimize,
  onNewConversation,
}: ChatbotHeaderProps) {
  return (
    <header className="chatbot-header">
      <AssistantCoinIcon className="chatbot-header-icon" />
      <div className="chatbot-title-block">
        <h2 id="chatbot-title">Asistente Vida</h2>
        <p><span aria-hidden="true" />En línea</p>
      </div>
      <div className="chatbot-header-actions">
        <button
          type="button"
          aria-label="Nueva conversación"
          title="Nueva conversación"
          onClick={onNewConversation}
        >
          ↻
        </button>
        <button
          type="button"
          aria-label="Minimizar Asistente Vida"
          title="Minimizar"
          onClick={onMinimize}
        >
          −
        </button>
        <button
          type="button"
          aria-label="Cerrar Asistente Vida"
          title="Cerrar"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </header>
  );
}
