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
};