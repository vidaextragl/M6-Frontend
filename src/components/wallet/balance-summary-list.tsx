import type { CurrencyBalance } from '../../types/wallet.types';

interface Props {
  currencies: CurrencyBalance[];
}

const currencyNames: Record<string, string> = {
  ARS: 'Argentine Peso',
  USD: 'US Dollar',
  EUR: 'Euro',
  CLP: 'Chilean Peso',
  COP: 'Colombian Peso',
  BRL: 'Brazilian Real',
};

export function BalanceSummaryList({ currencies }: Props) {
  return (
    <section className="currencies-section">
      <div className="section-heading">
        <h2>My currencies</h2>
        <button type="button">View wallet ›</button>
      </div>

      <div className="currencies-grid">
        {currencies.map((currency) => (
          <article className="currency-card" key={currency.code}>
            <div className="currency-top">
              <div className="currency-symbol">{currency.code[0]}</div>

              <div>
                <strong>{currency.code}</strong>
                <p>{currencyNames[currency.code]}</p>
              </div>

              <button type="button">•••</button>
            </div>

            <h3>
              {currency.symbol}
              {currency.balance.toLocaleString()}
              <span> {currency.code}</span>
            </h3>

            <p
              className={
                currency.changePercentage >= 0
                  ? 'positive-text'
                  : 'negative-text'
              }
            >
              {currency.changePercentage >= 0 ? '+' : ''}
              {currency.changePercentage}%
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}