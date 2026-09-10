import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { normalizeChatMessage } from './chatbot.utils';

interface ChatbotComposerProps {
  disabled: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onSend: (message: string) => void;
}

export function ChatbotComposer({ disabled, inputRef, onSend }: ChatbotComposerProps) {
  const [value, setValue] = useState('');

  function submit(event?: FormEvent): void {
    event?.preventDefault();
    const message = normalizeChatMessage(value);
    if (!message || disabled) return;
    onSend(message);
    setValue('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form className="chatbot-composer" onSubmit={submit}>
      <label htmlFor="chatbot-input" className="chatbot-visually-hidden">
        Escribe tu consulta
      </label>
      <textarea
        ref={inputRef}
        id="chatbot-input"
        rows={1}
        maxLength={500}
        value={value}
        placeholder="Escribe tu consulta…"
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        aria-label="Enviar consulta"
        disabled={disabled || value.trim().length === 0}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 12 14-7-5 14-2.5-5.5L5 12Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
