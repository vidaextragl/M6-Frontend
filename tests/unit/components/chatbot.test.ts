import { describe, it, expect } from 'vitest'
import { normalizeChatMessage, readChatbotReply } from '../../../src/components/chatbot/chatbot.utils'

describe('normalizeChatMessage', () => {
  it('normaliza una consulta y bloquea contenido vacío', () => {
    expect(normalizeChatMessage('  Consultar mi saldo  ')).toBe('Consultar mi saldo')
    expect(normalizeChatMessage('   ')).toBe('')
  })

  it('limita la consulta al máximo aceptado por el backend', () => {
    expect(normalizeChatMessage('a'.repeat(520)).length).toBe(500)
  })
})

describe('readChatbotReply', () => {
  it('acepta una respuesta válida del chatbot', () => {
    expect(readChatbotReply({ reply: '  Tu saldo está disponible.  ' })).toBe(
      'Tu saldo está disponible.',
    )
  })

  it('rechaza respuestas vacías o con contrato inválido', () => {
    expect(readChatbotReply({ reply: '' })).toBeNull()
    expect(readChatbotReply({ message: 'sin reply' })).toBeNull()
    expect(readChatbotReply(null)).toBeNull()
  })
})