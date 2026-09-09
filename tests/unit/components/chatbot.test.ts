import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeChatMessage,
  readChatbotReply,
} from '../../../src/components/chatbot/chatbot.utils.ts';

test('normaliza una consulta y bloquea contenido vacío', () => {
  assert.equal(normalizeChatMessage('  Consultar mi saldo  '), 'Consultar mi saldo');
  assert.equal(normalizeChatMessage('   '), '');
});

test('limita la consulta al máximo aceptado por el backend', () => {
  assert.equal(normalizeChatMessage('a'.repeat(520)).length, 500);
});

test('acepta una respuesta válida del chatbot', () => {
  assert.equal(readChatbotReply({ reply: '  Tu saldo está disponible.  ' }), 'Tu saldo está disponible.');
});

test('rechaza respuestas vacías o con contrato inválido', () => {
  assert.equal(readChatbotReply({ reply: '' }), null);
  assert.equal(readChatbotReply({ message: 'sin reply' }), null);
  assert.equal(readChatbotReply(null), null);
});
