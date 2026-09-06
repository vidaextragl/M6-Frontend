import { apiFetch } from './api-client';

export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'SWAP'
  | 'BUY'
  | 'REWARD_CASHBACK'
  | 'TRANSFER';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  fromCurrency: string | null;
  toCurrency: string | null;
  amountSent: string | null;
  amountReceived: string | null;
  exchangeRate: number | null;
  status: TransactionStatus;
  failedReason: string | null;
  createdAt: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListTransactionsParams {
  type?: TransactionType;
  currency?: string;
  status?: TransactionStatus;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

function buildQuery(params: ListTransactionsParams): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const transactionsApi = {
  async list(params: ListTransactionsParams = {}): Promise<TransactionsResponse> {
    return apiFetch<TransactionsResponse>(`/transactions${buildQuery(params)}`);
  },
};