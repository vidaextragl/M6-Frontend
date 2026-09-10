import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../components/ui/app-icon';
import { useEffect, useState, type FormEvent } from 'react';
import { WorkspaceSkeleton } from '../components/ui/skeleton-loader';
import { PageLayout } from '../components/layout/page-layout';
import { walletsApi } from '../api/wallets.api';
import { exchangeApi, type ExchangeRateQuote } from '../api/exchange.api';
import { rewardsApi, type RewardsSummary } from '../api/rewards.api';
import { transactionsApi, type Transaction } from '../api/transactions.api';
import { formatTransactionAmount, getTransactionLabel } from '../utils/transactions.utils';
import { getAmountValidationError } from '../utils/validators.utils';
import type { CashbackSummary, WalletSummary } from '../types/wallet.types';
import './dashboard-page.css';
import './exchange-modes.css';
import './wallet-actions.css';

type WorkspaceType =
  | 'wallet'
  | 'exchange'
  | 'cashback'
  | 'rewards'
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
  const navigate = useNavigate();
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
  walletsApi.getWallet().then(setWallet);
}, []);

  function openAction(nextAction: WalletAction) {
    setAction(nextAction);
    setCurrency('USD');
    setAmount('');
    setMessage('');
  }

  async function handleWalletAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountError = getAmountValidationError(amount);

    if (amountError) {
      setMessage(amountError);
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
        <div className="balance-info">
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
            {wallet.monthlyChangePercentage >= 0 ? '+' : ''}
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

         <button
  type="button"
  className="primary-action"
  onClick={() => navigate('/exchange')}
>
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
const EXCHANGE_CURRENCIES = ['USD', 'EUR', 'ARS', 'CLP', 'COP', 'BRL'];

function ExchangeContent() {
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
  const timer = window.setTimeout(() => setQuote(null), 0);

  return () => window.clearTimeout(timer);
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

  function reverseCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setMessage('');
  }

  async function handleExchange() {
    if (fromCurrency === toCurrency) {
      setStatus('error');
      setMessage('Pick two different currencies.');
      return;
    }

    const amountError = getAmountValidationError(amountToReceive);
    if (amountError) {
      setStatus('error');
      setMessage(amountError);
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

  const actionLabel = `Swap to ${toCurrency}`;

  return (
    <>
      <PageTitle
        eyebrow="EXCHANGE"
        title="Swap currencies"
        description="Exchange your money using current market rates."
      />

      <div className="exchange-layout">
        <section className="workspace-panel exchange-box">
          <p className="small-label">YOU PAY</p>
          <p className="exchange-input-hint">Calculated automatically from the amount you receive</p>

          <div className="exchange-input">
            <input
              value={
                quote && amountToPay > 0
                  ? amountToPay.toFixed(2)
                  : ''
              }
              readOnly
              aria-label="Amount to pay (calculated automatically, not editable)"
              title="Calculated automatically from the amount you receive"
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
  const [purchaseCurrency, setPurchaseCurrency] = useState('USD');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseStatus, setPurchaseStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle');
  const [purchaseMessage, setPurchaseMessage] = useState('');

  function loadCashback() {
    walletsApi.getCashback().then(setCashback);
  }

  useEffect(() => {
    loadCashback();
  }, []);

  async function handlePurchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountError = getAmountValidationError(purchaseAmount);
    if (amountError) {
      setPurchaseStatus('error');
      setPurchaseMessage(amountError);
      return;
    }

    setPurchaseStatus('loading');
    setPurchaseMessage('');

    try {
      const result = await exchangeApi.buy(purchaseCurrency, purchaseAmount);
      setPurchaseStatus('success');
      setPurchaseMessage(
        `Purchase completed — you earned ${result.cashback.amount} ${purchaseCurrency} in cashback (${result.cashback.points} points).`,
      );
      setPurchaseAmount('');
      loadCashback();
    } catch (err) {
      setPurchaseStatus('error');
      setPurchaseMessage(err instanceof Error ? err.message : 'Purchase failed.');
    }
  }

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

      <section className="workspace-panel cashback-purchase-simulator">
        <p className="small-label panel-title-caps">Simulate a purchase</p>
        <p className="muted-text">
          Spend from one of your balances (like buying a game) and earn cashback on it, up to the
          per-purchase, weekly and monthly limits.
        </p>

        <form onSubmit={handlePurchase} className="cashback-purchase-form">
          <label>
            <span>Currency</span>
            <select
              value={purchaseCurrency}
              onChange={(event) => setPurchaseCurrency(event.target.value)}
            >
              {EXCHANGE_CURRENCIES.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Amount spent</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={purchaseAmount}
              onChange={(event) => setPurchaseAmount(event.target.value)}
            />
          </label>

          <button
            type="submit"
            className="workspace-main-button"
            disabled={purchaseStatus === 'loading'}
          >
            {purchaseStatus === 'loading' ? 'Processing...' : 'Simulate purchase'}
          </button>
        </form>

        {purchaseMessage && (
          <p
            className={
              purchaseStatus === 'error'
                ? 'negative-text exchange-message'
                : 'positive-text exchange-message'
            }
          >
            {purchaseMessage}
          </p>
        )}
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

const INCOME_TYPES = ['DEPOSIT', 'REWARD_CASHBACK'];
const EXPENSE_TYPES = ['WITHDRAWAL', 'BUY'];
const EXCHANGE_TYPES = ['SWAP'];

function TransferForm({ onTransferred }: { onTransferred: () => void }) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  async function handleTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!recipientEmail.trim()) {
      setStatus('error');
      setMessage('Enter the recipient email.');
      return;
    }

    const amountError = getAmountValidationError(amount);
    if (amountError) {
      setStatus('error');
      setMessage(amountError);
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const result = await walletsApi.transfer(recipientEmail.trim(), currency, amount);
      setStatus('success');
      setMessage(`Sent ${result.transaction.amountSent} ${currency} to ${recipientEmail}.`);
      setAmount('');
      setRecipientEmail('');
      onTransferred();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Transfer failed.');
    }
  }

  return (
    <section className="workspace-panel transfer-form-panel">
      <p className="small-label panel-title-caps">Transfer to another user</p>
      <p className="muted-text">
        Send money from one of your balances to another Vida Extra user by email.
      </p>

      <form onSubmit={handleTransfer} className="transfer-form">
        <label className="transfer-form-email">
          <span>Recipient email</span>
          <input
            type="email"
            placeholder="friend@example.com"
            value={recipientEmail}
            onChange={(event) => setRecipientEmail(event.target.value)}
          />
        </label>

        <label>
          <span>Currency</span>
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
            {EXCHANGE_CURRENCIES.map((code) => (
              <option key={code}>{code}</option>
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
          />
        </label>

        <button type="submit" className="workspace-main-button" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send transfer'}
        </button>
      </form>

      {message && (
        <p className={status === 'error' ? 'negative-text exchange-message' : 'positive-text exchange-message'}>
          {message}
        </p>
      )}
    </section>
  );
}

function TransactionsContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'All' | 'Income' | 'Expenses' | 'Exchange'>('All');

  function loadTransactions() {
    transactionsApi.list({ limit: 50 }).then((res) => setTransactions(res.transactions));
  }

  useEffect(() => {
    loadTransactions();
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

      <TransferForm onTransferred={loadTransactions} />

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