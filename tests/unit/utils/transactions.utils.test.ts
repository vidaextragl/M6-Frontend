import { describe, it, expect } from 'vitest'
import { formatTransactionAmount, getTransactionLabel } from '../../../src/utils/transactions.utils'
import type { Transaction } from '../../../src/api/transactions.api'

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx-1',
    walletId: 'wallet-1',
    type: 'DEPOSIT',
    fromCurrency: null,
    toCurrency: null,
    amountSent: null,
    amountReceived: null,
    exchangeRate: null,
    status: 'COMPLETED',
    failedReason: null,
    createdAt: '2026-09-01T10:00:00.000Z',
    ...overrides,
  }
}

describe('getTransactionLabel', () => {
  it('devuelve "Deposit" para DEPOSIT', () => {
    expect(getTransactionLabel(makeTransaction({ type: 'DEPOSIT' }))).toBe('Deposit')
  })

  it('devuelve "Withdrawal" para WITHDRAWAL', () => {
    expect(getTransactionLabel(makeTransaction({ type: 'WITHDRAWAL' }))).toBe('Withdrawal')
  })

  it('devuelve "Swap" para SWAP', () => {
    expect(getTransactionLabel(makeTransaction({ type: 'SWAP' }))).toBe('Swap')
  })

  it('devuelve "Buy" para BUY', () => {
    expect(getTransactionLabel(makeTransaction({ type: 'BUY' }))).toBe('Buy')
  })

  it('devuelve "Cashback received" para REWARD_CASHBACK', () => {
    expect(getTransactionLabel(makeTransaction({ type: 'REWARD_CASHBACK' }))).toBe('Cashback received')
  })

  it('devuelve "Transfer" para TRANSFER', () => {
    expect(getTransactionLabel(makeTransaction({ type: 'TRANSFER' }))).toBe('Transfer')
  })
})

describe('formatTransactionAmount', () => {
  it('formatea un monto recibido como positivo', () => {
    const result = formatTransactionAmount(
      makeTransaction({ amountReceived: '100.00', toCurrency: 'USD' }),
    )
    expect(result).toEqual({ text: '+100.00 USD', positive: true })
  })

  it('formatea un monto enviado como negativo', () => {
    const result = formatTransactionAmount(
      makeTransaction({ amountSent: '50.00', fromCurrency: 'ARS' }),
    )
    expect(result).toEqual({ text: '-50.00 ARS', positive: false })
  })

  it('prioriza amountReceived sobre amountSent cuando ambos existen', () => {
    const result = formatTransactionAmount(
      makeTransaction({
        amountReceived: '90.00',
        toCurrency: 'EUR',
        amountSent: '100.00',
        fromCurrency: 'USD',
      }),
    )
    expect(result.positive).toBe(true)
    expect(result.text).toBe('+90.00 EUR')
  })

  it('devuelve un guion cuando no hay montos', () => {
    const result = formatTransactionAmount(makeTransaction())
    expect(result).toEqual({ text: '—', positive: false })
  })
})