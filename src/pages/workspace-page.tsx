import { useEffect, useState } from 'react';
import { WorkspaceSkeleton } from '../components/ui/skeleton-loader';
import { PageLayout } from '../components/layout/page-layout';
import { walletsApi } from '../api/wallets.api';
import { exchangeApi, type ExchangeRateQuote } from '../api/exchange.api';
import { rewardsApi, type RewardsSummary } from '../api/rewards.api';
import { transactionsApi, type Transaction } from '../api/transactions.api';
import { formatTransactionAmount, getTransactionLabel } from '../utils/transactions.utils';
import type { CashbackSummary, WalletSummary } from '../types/wallet.types';
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

export function WorkspacePage({ type }: WorkspacePageProps) {
  const [loadedType, setLoadedType] = useState<WorkspaceType | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoadedType(type);
    }, 300);

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
  const [wallet, setWallet] = useState<WalletSummary | null>(null);

  useEffect(() => {
    walletsApi.getWallet().then(setWallet);
  }, []);

  if (!wallet) return null;

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
          <h2>
            ${wallet.totalBalance.toFixed(2)} <span>USD</span>
          </h2>
          <p className={wallet.monthlyChangePercentage >= 0 ? 'positive-text' : 'negative-text'}>
            {wallet.monthlyChangePercentage >= 0 ? '↗' : '↘'} {wallet.monthlyChangePercentage}% this month
          </p>
        </div>

        <div className="workspace-actions">
          <button>Deposit</button>
          <button>Withdraw</button>
          <button className="primary-action">Swap ⇄</button>
        </div>
      </section>

      <div className="section-heading workspace-section-title">
        <h2>Your currencies</h2>
      </div>

      <div className="workspace-currency-grid">
        {wallet.currencies.map((currency) => (
          <article className="workspace-currency-card" key={currency.code}>
            <div className="workspace-currency-top">
              <span>{currency.code[0]}</span>
              <div>
                <strong>{currency.code}</strong>
                <p>{currency.name}</p>
              </div>
            </div>

            <h3>
              {currency.symbol}
              {currency.balance.toFixed(2)}
            </h3>

            <p className={currency.changePercentage >= 0 ? 'positive-text' : 'negative-text'}>
              {currency.changePercentage >= 0 ? '+' : ''}
              {currency.changePercentage}%
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

const EXCHANGE_CURRENCIES = ['USD', 'ARS', 'EUR', 'BRL'];

function ExchangeContent() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amountToReceive, setAmountToReceive] = useState('100');
  const [quote, setQuote] = useState<ExchangeRateQuote | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (fromCurrency === toCurrency) return;
    exchangeApi.getRate(fromCurrency, toCurrency).then(setQuote).catch(() => setQuote(null));
  }, [fromCurrency, toCurrency]);

  async function handleExchange() {
    setStatus('loading');
    try {
      await exchangeApi.swap(fromCurrency, toCurrency, amountToReceive);
      setStatus('success');
      setMessage('Exchange completed successfully.');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Exchange failed.');
    }
  }

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
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {EXCHANGE_CURRENCIES.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </div>

          <div className="exchange-divider">⇅</div>

          <p className="small-label">YOU RECEIVE</p>

          <div className="exchange-input">
            <input
              value={amountToReceive}
              onChange={(e) => setAmountToReceive(e.target.value)}
              inputMode="decimal"
            />
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {EXCHANGE_CURRENCIES.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </div>

          {quote && (
            <div className="exchange-rate">
              <span>Exchange rate</span>
              <strong>
                1 {fromCurrency} = {quote.rate} {toCurrency}
              </strong>
            </div>
          )}

          <button
            className="workspace-main-button"
            onClick={handleExchange}
            disabled={status === 'loading' || fromCurrency === toCurrency}
          >
            {status === 'loading' ? 'Processing...' : 'Confirm exchange'}
          </button>

          {message && (
            <p className={status === 'error' ? 'negative-text' : 'positive-text'}>{message}</p>
          )}
        </section>

        <section className="workspace-panel exchange-info">
          <p className="small-label">TODAY'S RATE</p>
          <h2>1 {fromCurrency}</h2>
          <h3>= {quote ? quote.rate : '...'} {toCurrency}</h3>
          <p>Rate provided by {quote?.provider ?? '—'}.</p>
        </section>
      </div>
    </>
  );
}

function CashbackContent() {
  const [cashback, setCashback] = useState<CashbackSummary | null>(null);

  useEffect(() => {
    walletsApi.getCashback().then(setCashback);
  }, []);

  if (!cashback) return null;

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
        <h2>${cashback.available.toFixed(2)}</h2>
        <p>Keep playing. Keep earning.</p>

        <div className="cashback-big-progress-title">
          <span>Monthly progress</span>
          <strong>{cashback.progressPercentage}%</strong>
        </div>

        <div className="cashback-big-track">
          <div style={{ width: `${cashback.progressPercentage}%` }} />
        </div>

        <small>
          ${cashback.monthlyEarned.toFixed(2)} of ${cashback.monthlyGoal.toFixed(2)} monthly goal
        </small>
      </section>
    </>
  );
}

function RewardsContent() {
  const [summary, setSummary] = useState<RewardsSummary | null>(null);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  function reload() {
    rewardsApi.getSummary().then(setSummary);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleRedeem(catalogItemId: string) {
    setRedeeming(catalogItemId);
    try {
      await rewardsApi.redeem(catalogItemId);
      reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo canjear la recompensa.');
    } finally {
      setRedeeming(null);
    }
  }

  if (!summary) return null;

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
          <h2>{summary.pointsBalance.toLocaleString()}</h2>
          <p>Extra Points</p>
        </div>

        <div className="rewards-medal">★</div>
      </section>

      <div className="workspace-three-grid">
        {summary.catalog.map((item) => (
          <article className="reward-card" key={item.id}>
            <div className="reward-icon">★</div>
            <h3>{item.name}</h3>
            <p>{item.description ?? 'Unlock this reward using your Extra Points.'}</p>
            <button
              disabled={summary.pointsBalance < item.costPoints || redeeming === item.id}
              onClick={() => handleRedeem(item.id)}
            >
              {redeeming === item.id ? 'Redeeming...' : `${item.costPoints} pts`}
            </button>
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
      </div>
    </>
  );
}

const INCOME_TYPES = ['DEPOSIT', 'REWARD_CASHBACK'];
const EXPENSE_TYPES = ['WITHDRAWAL', 'BUY'];
const EXCHANGE_TYPES = ['SWAP'];

function TransactionsContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'All' | 'Income' | 'Expenses' | 'Exchange'>('All');

  useEffect(() => {
    transactionsApi.list({ limit: 50 }).then((res) => setTransactions(res.transactions));
  }, []);

  const filtered = transactions.filter((tx) => {
    if (filter === 'All') return true;
    if (filter === 'Income') return INCOME_TYPES.includes(tx.type);
    if (filter === 'Expenses') return EXPENSE_TYPES.includes(tx.type);
    return EXCHANGE_TYPES.includes(tx.type);
  });

  return (
    <>
      <PageTitle
        eyebrow="ACTIVITY"
        title="Transactions"
        description="Review your latest account activity."
      />

      <div className="transaction-toolbar">
        {(['All', 'Income', 'Expenses', 'Exchange'] as const).map((tab) => (
          <button
            key={tab}
            className={filter === tab ? 'active-filter' : ''}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="workspace-panel">
        {filtered.map((tx) => {
          const amount = formatTransactionAmount(tx);
          return (
            <div className="workspace-transaction" key={tx.id}>
              <div className="workspace-transaction-left">
                <div>{tx.type[0]}</div>

                <span>
                  <strong>{getTransactionLabel(tx)}</strong>
                  <small>{new Date(tx.createdAt).toLocaleString()}</small>
                </span>
              </div>

              <strong className={amount.positive ? 'positive-text' : 'workspace-negative-amount'}>
                {amount.text}
              </strong>
            </div>
          );
        })}
      </section>
    </>
  );
}