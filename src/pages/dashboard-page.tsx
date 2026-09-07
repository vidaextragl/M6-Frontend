import { DashboardSkeleton } from '../components/ui/skeleton-loader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletsApi, transactionsApi } from '../api';
import type { Transaction } from '../api/transactions.api';
import { PageLayout } from '../components/layout/page-layout';
import { ExchangeRatesWidget } from '../components/exchange-rates/exchange-rates-widget';
import { BalanceCard, BalanceSummaryList } from '../components/wallet';
import { useAuth } from '../hooks/use-auth';
import { formatTransactionAmount, getTransactionLabel } from '../utils/transactions.utils';
import type {
  CashbackSummary,
  WalletSummary,
} from '../types/wallet.types';
import './dashboard-page.css';

const quickActions = [
  { icon: '↗', title: 'Buy currency', subtitle: 'Exchange funds', path: '/exchange' },
  { icon: '✣', title: 'Get cashback', subtitle: 'Earn rewards', path: '/cashback' },
  { icon: '⇄', title: 'Swap', subtitle: 'Move between wallets', path: '/exchange' },
  { icon: '▣', title: 'Deposit', subtitle: 'Add money', path: '/wallet' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [cashback, setCashback] = useState<CashbackSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    async function loadDashboard() {
      const [walletData, cashbackData, txData] = await Promise.all([
        walletsApi.getWallet(),
        walletsApi.getCashback(),
        transactionsApi.list({ limit: 3 }),
      ]);

      setWallet(walletData);
      setCashback(cashbackData);
      setRecentTransactions(txData.transactions);
    }

    loadDashboard();

    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const hour = now.getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';

 if (!wallet || !cashback) {
  return (
    <PageLayout>
      <DashboardSkeleton />
    </PageLayout>
  );
}

  return (
    <PageLayout>
      <section className="welcome">
        <p className="small-label">
          {now
            .toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
            .toUpperCase()}
        </p>

        <h1>
          {greeting}, {user?.name}
        </h1>

        <p>Here's your financial snapshot for today.</p>
      </section>
<ExchangeRatesWidget />
      <div className="top-dashboard-grid">
        <BalanceCard
          totalBalance={wallet.totalBalance}
          monthlyChangePercentage={wallet.monthlyChangePercentage}
          balanceHistory={wallet.balanceHistory}
        />

        <article className="cashback-card dashboard-card">
          <div className="cashback-symbol">✣</div>

          <p className="small-label">CASHBACK AVAILABLE</p>

          <h2>${cashback.available.toFixed(2)}</h2>

          <p className="muted-text">Keep playing. Keep earning.</p>

          <div className="progress-header">
            <span>Monthly progress</span>
            <span>{cashback.progressPercentage}%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${cashback.progressPercentage}%` }}
            />
          </div>

          <p className="cashback-progress-text">
            ${cashback.monthlyEarned.toFixed(2)} of $
            {cashback.monthlyGoal.toFixed(2)} available
          </p>

          <button type="button" className="outline-button" onClick={() => navigate('/cashback')}>
            View cashback ›
          </button>
        </article>
      </div>

      <div className="balance-actions">
        <button type="button" onClick={() => navigate('/wallet')}>Deposit</button>
        <button type="button" onClick={() => navigate('/wallet')}>Withdraw</button>
        <button type="button" className="mint-button" onClick={() => navigate('/exchange')}>
          Swap ⇄
        </button>
      </div>

      

      <BalanceSummaryList currencies={wallet.currencies} />

      <div className="bottom-dashboard-grid">
        <section className="transactions-section">
          <div className="section-heading">
            <h2>Recent transactions</h2>
            <button type="button" onClick={() => navigate('/transactions')}>View all ›</button>
          </div>

          <div className="transactions-card">
            {recentTransactions.map((transaction) => {
              const amount = formatTransactionAmount(transaction);
              return (
                <div className="transaction" key={transaction.id}>
                  <div className="transaction-left">
                    <div className="transaction-icon">{transaction.type[0]}</div>

                    <div>
                      <strong>{getTransactionLabel(transaction)}</strong>
                      <p>{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <span
                    className={
                      amount.positive
                        ? 'positive-text'
                        : 'transaction-amount'
                    }
                  >
                    {amount.text}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="quick-section">
          <div className="section-heading">
            <h2>Quick actions</h2>
          </div>

          <div className="quick-grid">
            {quickActions.map((action) => (
              <button
                type="button"
                className="quick-card"
                key={action.title}
                onClick={() => navigate(action.path)}
              >
                <span>{action.icon}</span>

                <div>
                  <strong>{action.title}</strong>
                  <p>{action.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}