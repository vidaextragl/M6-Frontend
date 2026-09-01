import { useEffect, useState } from 'react';  
import { WorkspaceSkeleton } from '../components/ui/skeleton-loader';
import { PageLayout } from '../components/layout/page-layout';
import './dashboard-page.css';

type WorkspaceType =
  | 'wallet'
  | 'exchange'
  | 'cashback'
  | 'rewards'
  | 'drops'
  | 'transactions';

interface WorkspacePageProps {
  type: WorkspaceType;
}

const currencies = [
  { code: 'ARS', name: 'Argentine Peso', value: '$425,000', change: '+1.8%' },
  { code: 'USD', name: 'US Dollar', value: '$3,200', change: '+2.4%' },
  { code: 'EUR', name: 'Euro', value: '€1,850', change: '-0.6%' },
  { code: 'CLP', name: 'Chilean Peso', value: '$780,000', change: '+0.9%' },
  { code: 'COP', name: 'Colombian Peso', value: '$2,450,000', change: '+1.2%' },
  { code: 'BRL', name: 'Brazilian Real', value: 'R$5,400', change: '-0.3%' },
];

const transactions = [
  ['Steam purchase', 'Gaming · Today, 10:24 AM', '-$24.90'],
  ['Cashback received', 'Cashback · Yesterday, 4:18 PM', '+$12.50'],
  ['USD to EUR swap', 'Exchange · Aug 28, 2026', '+€102.40'],
  ['Spotify', 'Entertainment · Aug 27, 2026', '-$9.99'],
  ['Salary payment', 'Income · Aug 25, 2026', '+$2,450.00'],
];

export function WorkspacePage({ type }: WorkspacePageProps) {
   const [loadedType, setLoadedType] = useState<WorkspaceType | null>(null);

useEffect(() => {
  const timer = window.setTimeout(() => {
    setLoadedType(type);
  }, 600);

  return () => window.clearTimeout(timer);
}, [type]);

if (loadedType !== type) {
  return (
    <PageLayout>
      <WorkspaceSkeleton />
    </PageLayout>
  );
}
  return (
    <PageLayout>
      {type === 'wallet' && <WalletContent />}
      {type === 'exchange' && <ExchangeContent />}
      {type === 'cashback' && <CashbackContent />}
      {type === 'rewards' && <RewardsContent />}
      {type === 'drops' && <DropsContent />}
      {type === 'transactions' && <TransactionsContent />}
    </PageLayout>
  );
}

function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="workspace-header">
      <p className="small-label">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

function WalletContent() {
  return (
    <>
      <PageTitle
        eyebrow="YOUR WALLET"
        title="Wallet"
        description="Manage your balances and currencies in one place."
      />

      <section className="workspace-hero">
        <div>
          <p className="small-label">TOTAL BALANCE</p>
          <h2>$12,450.75 <span>USD</span></h2>
          <p className="positive-text">↗ +8.4% this month</p>
        </div>

        <div className="workspace-actions">
          <button>Deposit</button>
          <button>Withdraw</button>
          <button className="primary-action">Swap ⇄</button>
        </div>
      </section>

      <div className="section-heading workspace-section-title">
        <h2>Your currencies</h2>
        <button type="button">Add currency +</button>
      </div>

      <div className="workspace-currency-grid">
        {currencies.map((currency) => (
          <article className="workspace-currency-card" key={currency.code}>
            <div className="workspace-currency-top">
              <span>{currency.code[0]}</span>
              <div>
                <strong>{currency.code}</strong>
                <p>{currency.name}</p>
              </div>
            </div>

            <h3>{currency.value}</h3>

            <p
              className={
                currency.change.startsWith('+')
                  ? 'positive-text'
                  : 'negative-text'
              }
            >
              {currency.change}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

function ExchangeContent() {
  return (
    <>
      <PageTitle
        eyebrow="EXCHANGE"
        title="Exchange currencies"
        description="Convert between your available currencies instantly."
      />

      <div className="exchange-layout">
        <section className="workspace-panel exchange-box">
          <p className="small-label">YOU SEND</p>

          <div className="exchange-input">
            <input defaultValue="1000" />
            <select defaultValue="USD">
              <option>USD</option>
              <option>ARS</option>
              <option>EUR</option>
              <option>BRL</option>
            </select>
          </div>

          <div className="exchange-divider">⇅</div>

          <p className="small-label">YOU RECEIVE</p>

          <div className="exchange-input">
            <input defaultValue="923.40" />
            <select defaultValue="EUR">
              <option>EUR</option>
              <option>USD</option>
              <option>ARS</option>
              <option>BRL</option>
            </select>
          </div>

          <div className="exchange-rate">
            <span>Exchange rate</span>
            <strong>1 USD = 0.9234 EUR</strong>
          </div>

          <button className="workspace-main-button">
            Review exchange
          </button>
        </section>

        <section className="workspace-panel exchange-info">
          <p className="small-label">TODAY'S RATE</p>
          <h2>1 USD</h2>
          <h3>= 0.9234 EUR</h3>
          <p>Rates shown are simulated frontend data.</p>

          <div className="exchange-stat">
            <span>Daily change</span>
            <strong className="positive-text">+0.42%</strong>
          </div>

          <div className="exchange-stat">
            <span>Estimated fee</span>
            <strong>$0.00</strong>
          </div>
        </section>
      </div>
    </>
  );
}

function CashbackContent() {
  return (
    <>
      <PageTitle
        eyebrow="CASHBACK"
        title="Your cashback"
        description="Earn rewards while using Vida Extra."
      />

      <section className="cashback-big-card">
        <div className="cashback-big-icon">✣</div>

        <p className="small-label">AVAILABLE CASHBACK</p>
        <h2>$85.40</h2>
        <p>Keep playing. Keep earning.</p>

        <div className="cashback-big-progress-title">
          <span>Monthly progress</span>
          <strong>71%</strong>
        </div>

        <div className="cashback-big-track">
          <div />
        </div>

        <small>$85.40 of $120.00 monthly goal</small>
      </section>

      <div className="workspace-three-grid">
        <article className="workspace-mini-card">
          <span>🎮</span>
          <p>Gaming cashback</p>
          <strong>$32.50</strong>
        </article>

        <article className="workspace-mini-card">
          <span>🛍</span>
          <p>Shopping cashback</p>
          <strong>$28.40</strong>
        </article>

        <article className="workspace-mini-card">
          <span>✦</span>
          <p>Bonus rewards</p>
          <strong>$24.50</strong>
        </article>
      </div>
    </>
  );
}

function RewardsContent() {
  return (
    <>
      <PageTitle
        eyebrow="REWARDS"
        title="Rewards"
        description="Use your points to unlock benefits."
      />

      <section className="rewards-banner">
        <div>
          <p className="small-label">YOUR POINTS</p>
          <h2>4,850</h2>
          <p>Extra Points</p>
        </div>

        <div className="rewards-medal">★</div>
      </section>

      <div className="workspace-three-grid">
        {[
          ['10% Cashback Boost', '1,500 pts'],
          ['Free exchange', '2,000 pts'],
          ['Premium badge', '3,500 pts'],
        ].map(([title, price]) => (
          <article className="reward-card" key={title}>
            <div className="reward-icon">★</div>
            <h3>{title}</h3>
            <p>Unlock this reward using your Extra Points.</p>
            <button>{price}</button>
          </article>
        ))}
      </div>
    </>
  );
}

function DropsContent() {
  return (
    <>
      <PageTitle
        eyebrow="DROPS"
        title="Exclusive drops"
        description="Limited rewards and benefits for Vida Extra users."
      />

      <div className="drops-grid">
        <article className="drop-card featured-drop">
          <span className="drop-tag">FEATURED</span>
          <h2>Gaming Week</h2>
          <p>Earn 2× cashback on selected gaming purchases.</p>
          <strong>Ends in 2 days</strong>
          <button>View drop</button>
        </article>

        <article className="drop-card">
          <span className="drop-tag">COMING SOON</span>
          <h2>Travel Bonus</h2>
          <p>Special cashback for international purchases.</p>
          <strong>Starts Sep 5</strong>
          <button>Remind me</button>
        </article>

        <article className="drop-card">
          <span className="drop-tag">LIMITED</span>
          <h2>Extra Friday</h2>
          <p>Unlock surprise benefits every Friday.</p>
          <strong>Weekly</strong>
          <button>Learn more</button>
        </article>
      </div>
    </>
  );
}

function TransactionsContent() {
  return (
    <>
      <PageTitle
        eyebrow="ACTIVITY"
        title="Transactions"
        description="Review your latest account activity."
      />

      <div className="transaction-toolbar">
        <button className="active-filter">All</button>
        <button>Income</button>
        <button>Expenses</button>
        <button>Exchange</button>
      </div>

      <section className="workspace-panel">
        {transactions.map(([name, detail, amount]) => (
          <div className="workspace-transaction" key={name}>
            <div className="workspace-transaction-left">
              <div>{name[0]}</div>

              <span>
                <strong>{name}</strong>
                <small>{detail}</small>
              </span>
            </div>

            <strong
              className={
                amount.startsWith('+')
                  ? 'positive-text'
                  : 'workspace-negative-amount'
              }
            >
              {amount}
            </strong>
          </div>
        ))}
      </section>
    </>
  );
}