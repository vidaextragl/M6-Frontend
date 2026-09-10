import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { chatbotApi } from '../../api/chatbot.api';
import { useAuth } from '../../hooks/use-auth';
import { ChatbotComposer } from './chatbot-composer';
import { ChatbotHeader } from './chatbot-header';
import { ChatbotLauncher } from './chatbot-launcher';
import { ChatbotMessages } from './chatbot-messages';
import type { ChatMessage } from './chatbot.types';
import { readChatbotReply } from './chatbot.utils';
import './chatbot.css';

const PROTECTED_PATHS = new Set([
  '/dashboard',
  '/wallet',
  '/exchange',
  '/cashback',
  '/rewards',
  '/transactions',
  '/notifications',
  '/settings',
]);

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}

export function Chatbot() {
  const { isAuthenticated, user } = useAuth();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const openRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(user?.id ?? null);

  const isProtectedPage = PROTECTED_PATHS.has(pathname);

  useEffect(() => {
    openRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (previousUserIdRef.current !== currentUserId) {
      abortRef.current?.abort();
      setMessages([]);
      setIsTyping(false);
      setHasNotification(false);
      setIsOpen(false);
      previousUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    function updateConnectionStatus(): void {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function closeWithEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsOpen(false);
        window.setTimeout(() => launcherRef.current?.focus(), 0);
      }
    }

    window.addEventListener('keydown', closeWithEscape);
    window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [isOpen]);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  const sendMessage = useCallback(async (content: string, retryId?: string) => {
    if (isTyping) return;

    const userMessage = retryId
      ? null
      : createMessage('user', content);

    setMessages((current) => retryId
      ? current.map((message) => message.id === retryId
        ? { ...message, failed: false, errorText: undefined }
        : message)
      : [...current, userMessage!]);
    setIsTyping(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      if (!navigator.onLine) {
        throw new Error('Sin conexión a internet. Revisa tu conexión e inténtalo nuevamente.');
      }

      const response = await chatbotApi.sendMessage(content, controller.signal);
      const reply = readChatbotReply(response);
      if (!reply) {
        throw new Error('El asistente devolvió una respuesta vacía. Inténtalo nuevamente.');
      }

      setMessages((current) => [...current, createMessage('assistant', reply)]);
      if (!openRef.current) setHasNotification(true);
    } catch (error) {
      if (controller.signal.aborted) return;
      const fallback = navigator.onLine
        ? 'No pudimos conectar con Asistente Vida. Inténtalo nuevamente.'
        : 'Sin conexión a internet. Revisa tu conexión e inténtalo nuevamente.';
      const errorText = error instanceof Error && error.message ? error.message : fallback;

      setMessages((current) => {
        const targetId = retryId ?? userMessage?.id;
        return current.map((message) =>
          message.id === targetId ? { ...message, failed: true, errorText } : message,
        );
      });
      if (!openRef.current) setHasNotification(true);
    } finally {
      if (!controller.signal.aborted) setIsTyping(false);
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, [isTyping]);

  function openChat(): void {
    setIsOpen(true);
    setHasNotification(false);
  }

  function startNewConversation(): void {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsTyping(false);
    setMessages([]);
    setHasNotification(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function retryMessage(message: ChatMessage): void {
    void sendMessage(message.content, message.id);
  }

  if (!isAuthenticated || !isProtectedPage) return null;

  return (
    <div className={`chatbot-root${isOpen ? ' chatbot-root-open' : ''}`}>
      {!isOpen && (
        <ChatbotLauncher
          ref={launcherRef}
          hasNotification={hasNotification}
          onClick={openChat}
        />
      )}

      {isOpen && (
        <section
          className="chatbot-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chatbot-title"
        >
          <ChatbotHeader
            onClose={closeChat}
            onMinimize={closeChat}
            onNewConversation={startNewConversation}
          />
          {!isOnline && (
            <div className="chatbot-offline" role="status">
              Sin conexión a internet. Podrás enviar mensajes cuando vuelva la conexión.
            </div>
          )}
          <ChatbotMessages
            ref={messagesRef}
            messages={messages}
            isTyping={isTyping}
            onRetry={retryMessage}
            onSuggestion={(suggestion) => void sendMessage(suggestion)}
          />
          <p className="chatbot-disclaimer">
            Las respuestas de la IA son orientativas. Los valores y tipos de cambio pueden variar.
          </p>
          <ChatbotComposer
            disabled={isTyping}
            inputRef={inputRef}
            onSend={(message) => void sendMessage(message)}
          />
        </section>
      )}
    </div>
  );
}
