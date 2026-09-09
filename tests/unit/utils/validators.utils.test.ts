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
})