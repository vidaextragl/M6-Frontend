import { apiFetch } from './api-client';
import type { Transaction } from './transactions.api';
import type { CashbackSummary, WalletSummary } from '../types/wallet.types';

interface BalanceView {
  currency: string;
  amount: string;
}

export interface TransferResult {
  transaction: Transaction;
  balance: BalanceView;
}

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
  // Backend endpoint todavía no existe — se agrega en el próximo PR. La forma del contrato
  // (`recipientEmail` + `currency` + `amount`, respuesta `{ transaction, balance }`) queda fijada
  // acá para implementar el backend exactamente así.
  async transfer(recipientEmail: string, currency: string, amount: string): Promise<TransferResult> {
    return apiFetch<TransferResult>('/wallet/transfer', {
      method: 'POST',
      body: JSON.stringify({ recipientEmail, currency, amount }),
    });
  },
};