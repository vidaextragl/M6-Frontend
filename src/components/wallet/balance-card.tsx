import type { BalanceHistoryPoint } from '../../types/wallet.types';

interface BalanceCardProps {
  totalBalance: number;
  monthlyChangePercentage: number;
  balanceHistory: BalanceHistoryPoint[];
}

export function BalanceCard({
  totalBalance,
  monthlyChangePercentage,
  balanceHistory,
}: BalanceCardProps) {
  const max = Math.max(...balanceHistory.map((item) => item.value));
  const min = Math.min(...balanceHistory.map((item) => item.value));
  const range = max - min || 1;

  const points = balanceHistory
    .map((item, index) => {
      const x =
        balanceHistory.length === 1
          ? 0
          : (index / (balanceHistory.length - 1)) * 100;

      const y = 42 - ((item.value - min) / range) * 30;

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <article className="balance-card dashboard-card">
      <div className="balance-header">
        <div>
          <p className="small-label">TOTAL BALANCE</p>

          <h2>
            $
            {totalBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
            <span> USD</span>
          </h2>

          <p className="positive-text">
            ↗ +{monthlyChangePercentage}%{' '}
            <span className="muted-text">this month</span>
          </p>
        </div>

        <button type="button" className="dots-button">
          •••
        </button>
      </div>

      <div className="chart-wrapper">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mintArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#75f0c1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#75f0c1" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polygon
            points={`0,50 ${points} 100,50`}
            fill="url(#mintArea)"
          />

          <polyline
            points={points}
            fill="none"
            stroke="#75f0c1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="chart-labels">
          {balanceHistory.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
      </div>
    </article>
  );
}