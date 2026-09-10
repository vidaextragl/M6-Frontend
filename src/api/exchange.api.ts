import { apiFetch } from './api-client';
import type { Transaction } from './transactions.api';

export interface ExchangeRateQuote {
  from: string;
  to: string;
  rate: number;
  provider: string;
  fetchedAt: string;
  source: 'memory_cache' | 'live' | 'local_fallback';
}

interface BalanceView {
  currency: string;
  amount: string;
}

export interface SwapResult {
  transaction: Transaction;
  fromBalance: BalanceView;
  toBalance: BalanceView;
  rate: number;
}

export interface BuyResult {
  purchase: Transaction;
  cashback: {
    transaction: Transaction;
    amount: string;
    points: number;
  };
  balance: BalanceView;
}

export const exchangeApi = {
  async getRate(from: string, to: string): Promise<ExchangeRateQuote> {
    return apiFetch<ExchangeRateQuote>(`/exchange-rates?from=${from}&to=${to}`);
  },
  async swap(fromCurrency: string, toCurrency: string, amountToReceive: string): Promise<SwapResult> {
    return apiFetch<SwapResult>('/exchange/swap', {
      method: 'POST',
      body: JSON.stringify({ fromCurrency, toCurrency, amountToReceive }),
    });
  },
  // Simula una compra (ej. un videojuego) pagada con el saldo de una sola moneda — a diferencia de
  // `swap`, no convierte entre dos monedas. Es lo que dispara el cashback automático (con los topes
  // por transacción/semana/mes) del lado del backend.
  async buy(currency: string, amount: string): Promise<BuyResult> {
    return apiFetch<BuyResult>('/exchange/buy', {
      method: 'POST',
      body: JSON.stringify({ currency, amount }),
    });
  },
};