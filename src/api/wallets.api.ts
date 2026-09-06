import { apiFetch } from './api-client';
import type { CashbackSummary, WalletSummary } from '../types/wallet.types';

export const walletsApi = {
  async getWallet(): Promise<WalletSummary> {
    return apiFetch<WalletSummary>('/wallet/summary');
  },
  async getCashback(): Promise<CashbackSummary> {
    return apiFetch<CashbackSummary>('/cashback/summary');
  },
  async deposit(currency: string, amount: string) {
    return apiFetch('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ currency, amount }),
    });
  },
  async withdraw(currency: string, amount: string) {
    return apiFetch('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ currency, amount }),
    });
  },
};