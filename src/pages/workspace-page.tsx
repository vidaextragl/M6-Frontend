import { AppIcon } from '../components/ui/app-icon';
import { useEffect, useState, type FormEvent } from 'react';
import { WorkspaceSkeleton } from '../components/ui/skeleton-loader';
import { PageLayout } from '../components/layout/page-layout';
import { walletsApi } from '../api/wallets.api';
import { exchangeApi, type ExchangeRateQuote } from '../api/exchange.api';
import { rewardsApi, type RewardsSummary } from '../api/rewards.api';
import { transactionsApi, type Transaction } from '../api/transactions.api';
import { formatTransactionAmount, getTransactionLabel } from '../utils/transactions.utils';
import type { CashbackSummary, WalletSummary } from '../types/wallet.types';
import './dashboard-page.css';
import './exchange-modes.css';
import './wallet-actions.css';

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

type WalletAction = 'deposit' | 'withdraw';

function WalletContent() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [action, setAction] = useState<WalletAction | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadWallet() {
    const walletData = await walletsApi.getWallet();
    setWallet(walletData);
  }

  useEffect(() => {
    void loadWallet();
  }, []);

  function openAction(nextAction: WalletAction) {
    setAction(nextAction);
    setCurrency('USD');
    setAmount('');
    setMessage('');
  }

  async function handleWalletAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage('Enter an amount greater than zero.');
      return;
    }

    if (!action) return;

    setSubmitting(true);
    setMessage('');

    try {
      await walletsApi[action](currency, amount);
      await loadWallet();
      setAction(null);
      setAmount('');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'The operation could not be completed.',
      );
    } finally {
      setSubmitting(false);
    }
  }

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

          <p
            className={
              wallet.monthlyChangePercentage >= 0
                ? 'positive-text'
                : 'negative-text'
            }
          >
            {wallet.monthlyChangePercentage >= 0 ? '↗️' : '↘️'}{' '}
            {wallet.monthlyChangePercentage}% this month
          </p>
        </div>

        <div className="workspace-actions">
          <button type="button" onClick={() => openAction('deposit')}>
            Deposit
          </button>

          <button type="button" onClick={() => openAction('withdraw')}>
            Withdraw
          </button>

          <button type="button" className="primary-action">
            Swap ⇄
          </button>
        </div>
      </section>

      <div className="section-heading workspace-section-title">
        <h2>Your currencies</h2>
      </div>

      <div className="workspace-currency-grid">
        {wallet.currencies.map((walletCurrency) => (
          <article
            className="workspace-currency-card"
            key={walletCurrency.code}
          >
            <div className="workspace-currency-top">
              <span>{walletCurrency.code[0]}</span>

              <div>
                <strong>{walletCurrency.code}</strong>
                <p>{walletCurrency.name}</p>
              </div>
            </div>

            <h3>
              {walletCurrency.symbol}
              {walletCurrency.balance.toFixed(2)}
            </h3>

            <p
              className={
                walletCurrency.changePercentage >= 0
                  ? 'positive-text'
                  : 'negative-text'
              }
            >
              {walletCurrency.changePercentage >= 0 ? '+' : ''}
              {walletCurrency.changePercentage}%
            </p>
          </article>
        ))}
      </div>

      {action && (
        <div className="wallet-modal-backdrop">
          <section
            className="wallet-action-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-action-title"
          >
            <div className="wallet-modal-heading">
              <div>
                <p className="small-label">WALLET OPERATION</p>
                <h2 id="wallet-action-title">
                  {action === 'deposit' ? 'Deposit funds' : 'Withdraw funds'}
                </h2>
              </div>

              <button
                type="button"
                className="wallet-modal-close"
                aria-label="Close"
                onClick={() => setAction(null)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleWalletAction}>
              <label>
                <span>Currency</span>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  {wallet.currencies.map((walletCurrency) => (
                    <option
                      key={walletCurrency.code}
                      value={walletCurrency.code}
                    >
                      {walletCurrency.code} — {walletCurrency.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Amount</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  autoFocus
                />
              </label>

              {message && <p className="wallet-action-error">{message}</p>}

              <button
                type="submit"
                className="wallet-confirm-button"
                disabled={submitting}
              >
                {submitting
                  ? 'Processing...'
                  : action === 'deposit'
                    ? 'Confirm deposit'
                    : 'Confirm withdrawal'}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
const EXCHANGE_CURRENCIES = ['USD', 'ARS', 'EUR', 'BRL'];

type ExchangeMode = 'buy' | 'sell' | 'swap';

function ExchangeContent() {
  const [mode, setMode] = useState<ExchangeMode>('buy');
  const [fromCurrency, setFromCurrency] = useState('ARS');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amountToReceive, setAmountToReceive] = useState('100');
  const [quote, setQuote] =
    useState<ExchangeRateQuote | null>(null);
  const [status, setStatus] =
    useState<'idle' | 'loading' | 'error' | 'success'>(
      'idle',
    );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setQuote(null);
      return;
    }

    exchangeApi
      .getRate(fromCurrency, toCurrency)
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [fromCurrency, toCurrency]);

  const amountToPay =
    quote && Number(amountToReceive) > 0
      ? Number(amountToReceive) / quote.rate
      : 0;

  function selectMode(nextMode: ExchangeMode) {
    setMode(nextMode);
    setMessage('');
    setStatus('idle');

    if (nextMode === 'buy') {
      setFromCurrency('ARS');
      setToCurrency('USD');
    }

    if (nextMode === 'sell') {
      setFromCurrency('USD');
      setToCurrency('ARS');
    }
  }

  function reverseCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setMessage('');
  }

  async function handleExchange() {
    if (
      fromCurrency === toCurrency ||
      Number(amountToReceive) <= 0
    ) {
      setStatus('error');
      setMessage('Enter a valid amount and two different currencies.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await exchangeApi.swap(
        fromCurrency,
        toCurrency,
        amountToReceive,
      );

      setStatus('success');
      setMessage('Exchange completed successfully.');
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof Error
          ? err.message
          : 'Exchange failed.',
      );
    }
  }

  const actionLabel =
    mode === 'buy'
      ? `Buy ${toCurrency}`
      : mode === 'sell'
        ? `Sell ${fromCurrency}`
        : `Swap to ${toCurrency}`;

  return (
    <>
      <PageTitle
        eyebrow="EXCHANGE"
        title={
          mode === 'buy'
            ? 'Buy currency'
            : mode === 'sell'
              ? 'Sell currency'
              : 'Swap currencies'
        }
        description="Exchange your money using current market rates."
      />

      <div className="exchange-mode-tabs">
        <button
          type="button"
          className={mode === 'buy' ? 'active' : ''}
          onClick={() => selectMode('buy')}
        >
          Buy
        </button>

        <button
          type="button"
          className={mode === 'sell' ? 'active' : ''}
          onClick={() => selectMode('sell')}
        >
          Sell
        </button>

        <button
          type="button"
          className={mode === 'swap' ? 'active' : ''}
          onClick={() => selectMode('swap')}
        >
          Swap
        </button>
      </div>

      <div className="exchange-layout">
        <section className="workspace-panel exchange-box">
          <p className="small-label">YOU PAY</p>

          <div className="exchange-input">
            <input
              value={
                quote && amountToPay > 0
                  ? amountToPay.toFixed(2)
                  : ''
              }
              readOnly
              aria-label="Amount to pay"
            />

            <select
              value={fromCurrency}
              onChange={(event) =>
                setFromCurrency(event.target.value)
              }
              aria-label="Currency to pay"
            >
              {EXCHANGE_CURRENCIES.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="exchange-reverse-button"
            onClick={reverseCurrencies}
            aria-label="Reverse currencies"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>

          <p className="small-label">YOU RECEIVE</p>

          <div className="exchange-input">
            <input
              value={amountToReceive}
              onChange={(event) =>
                setAmountToReceive(event.target.value)
              }
              inputMode="decimal"
              aria-label="Amount to receive"
            />

            <select
              value={toCurrency}
              onChange={(event) =>
                setToCurrency(event.target.value)
              }
              aria-label="Currency to receive"
            >
              {EXCHANGE_CURRENCIES.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </div>

          {quote && (
            <>
              <div className="exchange-rate">
                <span>Exchange rate</span>

                <strong>
                  1 {fromCurrency} = {quote.rate}{' '}
                  {toCurrency}
                </strong>
              </div>

              <div className="exchange-rate">
                <span>Rate provider</span>
                <strong>{quote.provider}</strong>
              </div>
            </>
          )}

          <button
            type="button"
            className="workspace-main-button"
            onClick={handleExchange}
            disabled={
              status === 'loading' ||
              fromCurrency === toCurrency
            }
          >
            {status === 'loading'
              ? 'Processing...'
              : actionLabel}
          </button>

          {message && (
            <p
              className={
                status === 'error'
                  ? 'negative-text exchange-message'
                  : 'positive-text exchange-message'
              }
            >
              {message}
            </p>
          )}
        </section>

        <section className="workspace-panel exchange-info">
          <p className="small-label">CURRENT RATE</p>

          <h2>1 {fromCurrency}</h2>

          <h3>
            = {quote ? quote.rate : '...'} {toCurrency}
          </h3>

          <p>
            {quote
              ? `Rate provided by ${quote.provider}.`
              : 'Loading current market rate...'}
          </p>

          {quote && (
            <p>
              Updated{' '}
              {new Date(quote.fetchedAt).toLocaleTimeString(
                [],
                {
                  hour: '2-digit',
                  minute: '2-digit',
                },
              )}
            </p>
          )}
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
function getRewardIcon(itemName: string) {
  const name = itemName.toLowerCase();

  if (
    name.includes('cupón') ||
    name.includes('cupon') ||
    name.includes('discount') ||
    name.includes('off')
  ) {
    return 'reward-ticket' as const;
  }

  if (name.includes('skin')) {
    return 'reward-gem' as const;
  }

  return 'reward-game' as const;
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
            <div className="reward-icon">
  <AppIcon name={getRewardIcon(item.name)} />
</div>
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