import { DashboardSkeleton } from '../components/ui/skeleton-loader';
import { useEffect, useState } from 'react';
import { walletsApi } from '../api';
import { PageLayout } from '../components/layout/page-layout';
import { BalanceCard, BalanceSummaryList } from '../components/wallet';
import { useAuth } from '../hooks/use-auth';
import type {
  CashbackSummary,
  WalletSummary,
} from '../types/wallet.types';
import './dashboard-page.css';

const transactions = [
  {
    name: 'Steam purchase',
    description: 'Gaming · Today, 10:24 AM',
    amount: '-$24.90',
    icon: '▣',
  },
  {
    name: 'Cashback received',
    description: 'Cashback · Yesterday, 4:18 PM',
    amount: '+$12.50',
    icon: '✣',
    positive: true,
  },
  {
    name: 'USD to EUR swap',
    description: 'Swap · Aug 28, 2026',
    amount: '+€102.40',
    icon: '⇄',
    positive: true,
  },
];

const quickActions = [
  { icon: '↗', title: 'Buy currency', subtitle: 'Exchange funds' },
  { icon: '✣', title: 'Get cashback', subtitle: 'Earn rewards' },
  { icon: '⇄', title: 'Swap', subtitle: 'Move between wallets' },
  { icon: '▣', title: 'Deposit', subtitle: 'Add money' },
];

export function DashboardPage() {
  const { user } = useAuth();

  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [cashback, setCashback] = useState<CashbackSummary | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    async function loadDashboard() {
      const [walletData, cashbackData] = await Promise.all([
        walletsApi.getWallet(),
        walletsApi.getCashback(),
      ]);

      setWallet(walletData);
      setCashback(cashbackData);
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

          <button type="button" className="outline-button">
            View cashback ›
          </button>
        </article>
      </div>

      <div className="balance-actions">
        <button type="button">Deposit</button>
        <button type="button">Withdraw</button>
        <button type="button" className="mint-button">
          Swap ⇄
        </button>
      </div>

      <BalanceSummaryList currencies={wallet.currencies} />

      <div className="bottom-dashboard-grid">
        <section className="transactions-section">
          <div className="section-heading">
            <h2>Recent transactions</h2>
            <button type="button">View all ›</button>
          </div>

          <div className="transactions-card">
            {transactions.map((transaction) => (
              <div className="transaction" key={transaction.name}>
                <div className="transaction-left">
                  <div className="transaction-icon">{transaction.icon}</div>

                  <div>
                    <strong>{transaction.name}</strong>
                    <p>{transaction.description}</p>
                  </div>
                </div>

                <span
                  className={
                    transaction.positive
                      ? 'positive-text'
                      : 'transaction-amount'
                  }
                >
                  {transaction.amount}
                </span>
              </div>
            ))}
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