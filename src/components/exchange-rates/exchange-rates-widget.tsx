import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  exchangeApi,
  type ExchangeRateQuote,
} from '../../api/exchange.api';
import './exchange-rates-widget.css';

type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'CLP' | 'COP' | 'BRL';

const currencies: CurrencyCode[] = [
  'ARS',
  'USD',
  'EUR',
  'CLP',
  'COP',
  'BRL',
];
const currencyNames: Record<CurrencyCode, string> = {
  ARS: 'Argentine Peso',
  USD: 'US Dollar',
  EUR: 'Euro',
  CLP: 'Chilean Peso',
  COP: 'Colombian Peso',
  BRL: 'Brazilian Real',
};
const featuredPairs: Array<{
  from: CurrencyCode;
  to: CurrencyCode;
}> = [
  { from: 'USD', to: 'ARS' },
  { from: 'EUR', to: 'ARS' },
  { from: 'BRL', to: 'ARS' },
  { from: 'USD', to: 'CLP' },
  { from: 'USD', to: 'COP' },
];

function SwapIcon() {
  return (
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
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 7v5h-5M4 17v-5h5M6.1 8a7 7 0 0 1 11.7-2.2L20 8M4 16l2.2 2.2A7 7 0 0 0 18 16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function formatNumber(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits:
      currency === 'EUR' || currency === 'USD' || currency === 'BRL'
        ? 4
        : 2,
  }).format(value);
}

export function ExchangeRatesWidget() {
  const navigate = useNavigate();

  const [fromCurrency, setFromCurrency] =
    useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] =
    useState<CurrencyCode>('ARS');
  const [amount, setAmount] = useState('1');
  const [quote, setQuote] =
    useState<ExchangeRateQuote | null>(null);
  const [marketQuotes, setMarketQuotes] =
    useState<ExchangeRateQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    exchangeApi
      .getRate(fromCurrency, toCurrency)
      .then((data) => {
        if (!cancelled) setQuote(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setQuote(null);
          setError(
            err instanceof Error
              ? err.message
              : 'Could not load the exchange rate.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fromCurrency, toCurrency, refreshKey]);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      featuredPairs.map(async ({ from, to }) => {
        try {
          return await exchangeApi.getRate(from, to);
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (!cancelled) {
        setMarketQuotes(
          results.filter(
            (result): result is ExchangeRateQuote =>
              result !== null,
          ),
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const convertedAmount = useMemo(() => {
    const numericAmount = Number(amount);

    if (!quote || !Number.isFinite(numericAmount)) return 0;

    return Math.max(0, numericAmount) * quote.rate;
  }, [amount, quote]);

  function handleSwapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  function handleFromChange(currency: CurrencyCode) {
    if (currency === toCurrency) {
      setToCurrency(fromCurrency);
    }

    setFromCurrency(currency);
  }

  function handleToChange(currency: CurrencyCode) {
    if (currency === fromCurrency) {
      setFromCurrency(toCurrency);
    }

    setToCurrency(currency);
  }

  return (
    <section className="exchange-rates-section">
      <div className="exchange-rates-heading">
        <div>
          <p className="small-label">LIVE MARKET</p>
          <h2>Exchange rates</h2>
          <p>Check current rates and convert currencies.</p>
        </div>

        <button
          type="button"
          className="rates-refresh-button"
          onClick={() => setRefreshKey((value) => value + 1)}
          aria-label="Refresh exchange rates"
        >
          <RefreshIcon />
          Refresh
        </button>
      </div>

      <div className="exchange-rates-grid">
        <article className="rates-converter">
          <h3>Currency converter</h3>

          <div className="rates-selectors">
            <label>
              <span>From</span>
              <select
                value={fromCurrency}
                onChange={(event) =>
                  handleFromChange(
                    event.target.value as CurrencyCode,
                  )
                }
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="rates-swap-button"
              onClick={handleSwapCurrencies}
              aria-label="Reverse currencies"
            >
              <SwapIcon />
            </button>

            <label>
              <span>To</span>
              <select
                value={toCurrency}
                onChange={(event) =>
                  handleToChange(
                    event.target.value as CurrencyCode,
                  )
                }
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="rates-amount">
            <span>Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>

         <div className="rates-result">
  {loading ? (
    <>
      <span>Loading current exchange rate...</span>
      <div className="rates-loading" />
    </>
  ) : error ? (
    <div className="rates-error">
      <p>{error}</p>

      <button
        type="button"
        onClick={() =>
          setRefreshKey((value) => value + 1)
        }
      >
        Try again
      </button>
    </div>
  ) : (
    <>
      <span>
        1 {currencyNames[fromCurrency]} equals
      </span>

      <strong>
        {quote
          ? formatNumber(quote.rate, toCurrency)
          : '—'}{' '}
        {currencyNames[toCurrency]}
      </strong>

      <p>
        {amount || '0'} {fromCurrency} ={' '}
        {formatNumber(convertedAmount, toCurrency)}{' '}
        {toCurrency}
      </p>
    </>
  )}
</div>

<button
  type="button"
  className="rates-exchange-button"
  onClick={() => navigate('/exchange')}
>
  Go to Exchange
</button>
        </article>

        <article className="market-overview">
          <div className="market-overview-heading">
            <h3>Market overview</h3>
            <span>Current rates</span>
          </div>

          <div className="market-rates-list">
            {marketQuotes.length === 0 ? (
              <div className="market-loading">
                Loading market rates...
              </div>
            ) : (
              marketQuotes.map((marketQuote) => (
                <button
                  type="button"
                  className="market-rate-row"
                  key={`${marketQuote.from}-${marketQuote.to}`}
                  onClick={() => {
                    setFromCurrency(
                      marketQuote.from as CurrencyCode,
                    );
                    setToCurrency(
                      marketQuote.to as CurrencyCode,
                    );
                  }}
                >
                  <span>
                    <strong>
                      {marketQuote.from}/{marketQuote.to}
                    </strong>
                    <small>{marketQuote.provider}</small>
                  </span>

                  <strong>
                    {formatNumber(
                      marketQuote.rate,
                      marketQuote.to as CurrencyCode,
                    )}
                  </strong>
                </button>
              ))
            )}
          </div>

          <div className="rates-update-info">
            <span>
              {quote
                ? `Updated ${new Date(
                    quote.fetchedAt,
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'Waiting for current rates'}
            </span>

            <span>
              {quote?.source === 'live'
                ? 'Live data'
                : quote?.source === 'memory_cache'
                  ? 'Cached data'
                  : quote
                    ? 'Reference data'
                    : ''}
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}