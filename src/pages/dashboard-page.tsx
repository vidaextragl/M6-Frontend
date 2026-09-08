import { AppIcon } from '../components/ui/app-icon';
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
import './dashboard-buy-button.css';

const quickActions = [
  {
    icon: <AppIcon name="buy" />,
    title: 'Buy currency',
    subtitle: 'Exchange funds',
    path: '/exchange?mode=buy',
  },
  {
    icon: <AppIcon name="cashback" />,
    title: 'Get cashback',
    subtitle: 'Earn rewards',
    path: '/cashback',
  },
  {
    icon: '⇄',
    title: 'Swap',
    subtitle: 'Move between wallets',
    path: '/exchange?mode=swap',
  },
  {
    icon: <AppIcon name="deposit" />,
    title: 'Deposit',
    subtitle: 'Add money',
    path: '/wallet',
  },
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
      <section className="welcome dashboard-welcome">
  <div>
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
  </div>

  <button
    type="button"
    className="buy-currency-button"
    onClick={() => navigate('/exchange?mode=buy')}
  >
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    Buy currency
  </button>
</section>
<ExchangeRatesWidget />
      <div className="top-dashboard-grid">
        <BalanceCard
          totalBalance={wallet.totalBalance}
          monthlyChangePercentage={wallet.monthlyChangePercentage}
          balanceHistory={wallet.balanceHistory}
        />

        <article className="cashback-card dashboard-card">
          <div className="cashback-symbol">
  <AppIcon name="cashback" />
</div>

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
      <button
  type="button"
  className="mint-button"
  onClick={() => navigate('/exchange')}
>
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 5v14M7 10l5-5 5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  Buy currency
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