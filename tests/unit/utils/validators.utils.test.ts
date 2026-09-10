import { describe, it, expect } from 'vitest'
import { isStrongPassword } from '../../../src/utils/validators.utils'

describe('isStrongPassword', () => {
  it('rechaza una contraseña con menos de 8 caracteres', () => {
    expect(isStrongPassword('Ab1!')).toBe(false)
  })

  it('rechaza una contraseña sin mayúscula', () => {
    expect(isStrongPassword('abcdefg1!')).toBe(false)
  })

  it('rechaza una contraseña sin número', () => {
    expect(isStrongPassword('Abcdefgh!')).toBe(false)
  })

  it('rechaza una contraseña sin carácter especial', () => {
    expect(isStrongPassword('Abcdefg1')).toBe(false)
  })

  it('rechaza una contraseña vacía', () => {
    expect(isStrongPassword('')).toBe(false)
  })

  it('acepta una contraseña que cumple los 4 requisitos', () => {
    expect(isStrongPassword('Abcdefg1!')).toBe(true)
  })

  it('acepta una contraseña larga con múltiples caracteres especiales', () => {
    expect(isStrongPassword('SuperSegura123!@#')).toBe(true)
  })

  it('rechaza una contraseña que solo tiene números', () => {
    expect(isStrongPassword('12345678')).toBe(false)
  })

  it('acepta una contraseña con espacios que igual cumple los requisitos', () => {
    expect(isStrongPassword('Clave Segura 1!')).toBe(true)
  })

  it('rechaza una contraseña compuesta solo por espacios', () => {
    expect(isStrongPassword('        ')).toBe(false)
  })

  it('acepta una contraseña muy larga que cumple los requisitos', () => {
    expect(isStrongPassword(`Ab1!${'a'.repeat(300)}`)).toBe(true)
  })

  it('acepta una contraseña con emojis siempre que cumpla los requisitos', () => {
    expect(isStrongPassword('Abcdefg1!😀🎉')).toBe(true)
  })

  it('rechaza una contraseña formada solo por emojis', () => {
    expect(isStrongPassword('😀🎉🔥🚀')).toBe(false)
  })
})