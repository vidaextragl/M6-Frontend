import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch } from '../../../src/api/api-client'

function mockFetchResponse(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  })
}

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('mapea un código de error conocido a su mensaje en español', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(401, { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }))

    await expect(apiFetch('/auth/login', { method: 'POST' })).rejects.toThrow(
      'Email o contraseña incorrectos',
    )
  })

  it('usa el mensaje original del backend cuando el código no está mapeado', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(400, { error: 'Something unexpected', code: 'UNKNOWN_CODE' }))

    await expect(apiFetch('/some-endpoint')).rejects.toThrow('Something unexpected')
  })

  it('usa un mensaje genérico cuando el backend no manda código ni texto de error', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(500, {}))

    await expect(apiFetch('/some-endpoint')).rejects.toThrow(
      'Ocurrió un error inesperado, intentá de nuevo',
    )
  })

  it('devuelve los datos parseados cuando la respuesta es exitosa', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(200, { user: { id: '1', name: 'Juan' } }))

    const result = await apiFetch('/users/me')
    expect(result).toEqual({ user: { id: '1', name: 'Juan' } })
  })
})