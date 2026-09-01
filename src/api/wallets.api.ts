import type { CashbackSummary, WalletSummary } from '../types/wallet.types';

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const mockWallet: WalletSummary = {
  totalBalance: 12450.75,
  monthlyChangePercentage: 8.4,

  balanceHistory: [
    { label: 'Mon', value: 10800 },
    { label: 'Tue', value: 11200 },
    { label: 'Wed', value: 11050 },
    { label: 'Thu', value: 11700 },
    { label: 'Fri', value: 12100 },
    { label: 'Sat', value: 11950 },
    { label: 'Sun', value: 12450.75 },
  ],

  currencies: [
    {
      code: 'ARS',
      name: 'Argentine Peso',
      symbol: '$',
      balance: 425000,
      changePercentage: 1.8,
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      balance: 3200,
      changePercentage: 2.4,
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      balance: 1850,
      changePercentage: -0.6,
    },
    {
      code: 'CLP',
      name: 'Chilean Peso',
      symbol: '$',
      balance: 780000,
      changePercentage: 0.9,
    },
    {
      code: 'COP',
      name: 'Colombian Peso',
      symbol: '$',
      balance: 2450000,
      changePercentage: 1.2,
    },
    {
      code: 'BRL',
      name: 'Brazilian Real',
      symbol: 'R$',
      balance: 5400,
      changePercentage: -0.3,
    },
  ],
};

const mockCashback: CashbackSummary = {
  available: 85.4,
  monthlyEarned: 85.4,
  monthlyGoal: 120,
  progressPercentage: 71,
};

export const walletsApi = {
  async getWallet(): Promise<WalletSummary> {
    await delay(500);
    return mockWallet;
  },

  async getCashback(): Promise<CashbackSummary> {
    await delay(500);
    return mockCashback;
  },
};