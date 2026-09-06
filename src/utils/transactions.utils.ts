import type { Transaction } from '../api/transactions.api';

const TYPE_LABELS: Record<Transaction['type'], string> = {
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  SWAP: 'Swap',
  BUY: 'Buy',
  REWARD_CASHBACK: 'Cashback received',
  TRANSFER: 'Transfer',
};

export function getTransactionLabel(tx: Transaction): string {
  return TYPE_LABELS[tx.type] ?? tx.type;
}

export function formatTransactionAmount(tx: Transaction): { text: string; positive: boolean } {
  if (tx.amountReceived && tx.toCurrency) {
    return { text: `+${tx.amountReceived} ${tx.toCurrency}`, positive: true };
  }
  if (tx.amountSent && tx.fromCurrency) {
    return { text: `-${tx.amountSent} ${tx.fromCurrency}`, positive: false };
  }
  return { text: '—', positive: false };
}