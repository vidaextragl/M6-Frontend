export interface CurrencyBalance {
  code: 'ARS' | 'USD' | 'EUR' | 'CLP' | 'COP' | 'BRL';
  name: string;
  symbol: string;
  balance: number;
  changePercentage: number;
}

export interface BalanceHistoryPoint {
  label: string;
  value: number;
}

export interface WalletSummary {
  totalBalance: number;
  monthlyChangePercentage: number;
  balanceHistory: BalanceHistoryPoint[];
  currencies: CurrencyBalance[];
}

export interface CashbackSummary {
  available: number;
  monthlyEarned: number;
  monthlyGoal: number;
  progressPercentage: number;
}