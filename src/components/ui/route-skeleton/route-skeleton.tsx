import '../../../styles/route-skeleton.css';

interface RouteSkeletonProps {
  pathname: string;
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`route-skeleton-block ${className}`}
      aria-hidden="true"
    />
  );
}

function SkeletonHeader() {
  return (
    <div className="route-skeleton-header">
      <SkeletonBlock className="route-skeleton-eyebrow" />
      <SkeletonBlock className="route-skeleton-title" />
      <SkeletonBlock className="route-skeleton-description" />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="route-dashboard-top">
        <SkeletonBlock className="route-dashboard-balance" />
        <SkeletonBlock className="route-dashboard-cashback" />
      </div>

      <SkeletonBlock className="route-section-heading" />

      <div className="route-dashboard-currencies">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock
            className="route-currency-card"
            key={index}
          />
        ))}
      </div>

      <div className="route-dashboard-bottom">
        <SkeletonBlock className="route-transactions-card" />
        <SkeletonBlock className="route-actions-card" />
      </div>
    </>
  );
}

function WalletSkeleton() {
  return (
    <>
      <SkeletonBlock className="route-wallet-balance" />
      <SkeletonBlock className="route-section-heading" />

      <div className="route-wallet-currencies">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock
            className="route-wallet-currency"
            key={index}
          />
        ))}
      </div>
    </>
  );
}

function ExchangeSkeleton() {
  return (
    <div className="route-exchange-grid">
      <div className="route-skeleton-surface route-exchange-form">
        <SkeletonBlock className="route-input-label" />
        <SkeletonBlock className="route-exchange-input" />
        <SkeletonBlock className="route-exchange-switch" />
        <SkeletonBlock className="route-input-label" />
        <SkeletonBlock className="route-exchange-input" />
        <SkeletonBlock className="route-exchange-button" />
      </div>

      <div className="route-skeleton-surface route-exchange-info">
        <SkeletonBlock className="route-input-label" />
        <SkeletonBlock className="route-rate-title" />
        <SkeletonBlock className="route-rate-value" />
        <SkeletonBlock className="route-info-line" />
        <SkeletonBlock className="route-info-line" />
      </div>
    </div>
  );
}

function CashbackSkeleton() {
  return (
    <>
      <div className="route-skeleton-surface route-cashback-main">
        <SkeletonBlock className="route-cashback-icon" />
        <SkeletonBlock className="route-input-label" />
        <SkeletonBlock className="route-cashback-value" />
        <SkeletonBlock className="route-cashback-progress" />
      </div>

      <div className="route-three-cards">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock
            className="route-cashback-small-card"
            key={index}
          />
        ))}
      </div>
    </>
  );
}

function RewardsSkeleton() {
  return (
    <>
      <div className="route-skeleton-surface route-rewards-banner">
        <div>
          <SkeletonBlock className="route-input-label" />
          <SkeletonBlock className="route-rewards-points" />
          <SkeletonBlock className="route-info-line" />
        </div>

        <SkeletonBlock className="route-rewards-medal" />
      </div>

      <div className="route-three-cards">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock
            className="route-reward-card"
            key={index}
          />
        ))}
      </div>
    </>
  );
}

function DropsSkeleton() {
  return (
    <div className="route-three-cards">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="route-skeleton-surface route-drop-card" key={index}>
          <SkeletonBlock className="route-drop-tag" />
          <SkeletonBlock className="route-drop-title" />
          <SkeletonBlock className="route-drop-text" />
          <SkeletonBlock className="route-drop-text short" />
          <SkeletonBlock className="route-drop-button" />
        </div>
      ))}
    </div>
  );
}

function TransactionsSkeleton() {
  return (
    <>
      <div className="route-skeleton-tabs">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock className="route-tab" key={index} />
        ))}
      </div>

      <div className="route-skeleton-surface route-row-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="route-transaction-row" key={index}>
            <SkeletonBlock className="route-row-icon" />

            <div className="route-row-copy">
              <SkeletonBlock className="route-row-title" />
              <SkeletonBlock className="route-row-description" />
            </div>

            <SkeletonBlock className="route-row-amount" />
          </div>
        ))}
      </div>
    </>
  );
}

function NotificationsSkeleton() {
  return (
    <>
      <div className="route-skeleton-tabs">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock className="route-notification-tab" key={index} />
        ))}
      </div>

      <div className="route-skeleton-surface route-notification-list">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="route-notification-row" key={index}>
            <SkeletonBlock className="route-notification-icon" />

            <div className="route-row-copy">
              <SkeletonBlock className="route-row-title" />
              <SkeletonBlock className="route-notification-description" />
              <SkeletonBlock className="route-notification-time" />
            </div>

            <SkeletonBlock className="route-notification-action" />
          </div>
        ))}
      </div>
    </>
  );
}

function SettingsSkeleton() {
  return (
    <div className="route-settings-grid">
      <div className="route-skeleton-surface route-settings-profile">
        <SkeletonBlock className="route-settings-card-title" />
        <div className="route-settings-user">
          <SkeletonBlock className="route-settings-avatar" />
          <SkeletonBlock className="route-settings-user-name" />
        </div>
        <div className="route-settings-inputs">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock className="wide" />
        </div>
      </div>

      <div className="route-skeleton-surface route-settings-preferences">
        <SkeletonBlock className="route-settings-card-title" />

        {Array.from({ length: 3 }).map((_, index) => (
          <div className="route-settings-option" key={index}>
            <SkeletonBlock className="route-settings-option-text" />
            <SkeletonBlock className="route-settings-toggle" />
          </div>
        ))}
      </div>

      <div className="route-skeleton-surface route-settings-security">
        <SkeletonBlock className="route-settings-card-title" />

        <div className="route-settings-buttons">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
      </div>
    </div>
  );
}

export function RouteSkeleton({ pathname }: RouteSkeletonProps) {
  const routeName = pathname.split('/')[1] || 'dashboard';

  return (
    <div
      className={`route-skeleton route-skeleton-${routeName}`}
      role="status"
      aria-label="Loading page"
    >
      <SkeletonHeader />

      {routeName === 'dashboard' && <DashboardSkeleton />}
      {routeName === 'wallet' && <WalletSkeleton />}
      {routeName === 'exchange' && <ExchangeSkeleton />}
      {routeName === 'cashback' && <CashbackSkeleton />}
      {routeName === 'rewards' && <RewardsSkeleton />}
      {routeName === 'drops' && <DropsSkeleton />}
      {routeName === 'transactions' && <TransactionsSkeleton />}
      {routeName === 'notifications' && <NotificationsSkeleton />}
      {routeName === 'settings' && <SettingsSkeleton />}
    </div>
  );
}