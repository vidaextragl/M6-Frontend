import { useState } from 'react';
import { PageLayout } from '../components/layout/page-layout';
import '../styles/notifications-page.css';

type NotificationCategory =
  | 'All'
  | 'Transactions'
  | 'Cashback'
  | 'Rewards'
  | 'Exchange alerts';

interface NotificationItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  time: string;
  category: Exclude<NotificationCategory, 'All'>;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    icon: '$',
    title: 'Cashback received',
    description: 'You received $12.50 from Steam.',
    time: '12 min ago',
    category: 'Cashback',
  },
  {
    id: 2,
    icon: '⇄',
    title: 'Exchange rate alert',
    description: 'USD → ARS reached your target rate.',
    time: '2 hours ago',
    category: 'Exchange alerts',
  },
  {
    id: 3,
    icon: '✓',
    title: 'Transaction completed',
    description: 'Your swap of USD to EUR was completed.',
    time: 'Yesterday',
    category: 'Transactions',
  },
  {
    id: 4,
    icon: '★',
    title: 'New reward available',
    description: 'A cashback boost is ready to redeem.',
    time: '2 days ago',
    category: 'Rewards',
  },
];

function getInitialReadIds(): number[] {
  try {
    const savedValue = JSON.parse(
      localStorage.getItem('vida-extra:read-notifications') ?? '[]',
    );

    return Array.isArray(savedValue) ? savedValue : [];
  } catch {
    return [];
  }
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationCategory>('All');
  const [readIds, setReadIds] = useState<number[]>(getInitialReadIds);

  const categories: NotificationCategory[] = [
    'All',
    'Transactions',
    'Cashback',
    'Rewards',
    'Exchange alerts',
  ];

  const visibleNotifications =
    filter === 'All'
      ? notifications
      : notifications.filter(
          (notification) => notification.category === filter,
        );

  const unreadCount = notifications.filter(
    (notification) => !readIds.includes(notification.id),
  ).length;

  function saveReadIds(nextIds: number[]) {
    setReadIds(nextIds);
    localStorage.setItem(
      'vida-extra:read-notifications',
      JSON.stringify(nextIds),
    );
  }

  function markAsRead(id: number) {
    if (!readIds.includes(id)) {
      saveReadIds([...readIds, id]);
    }
  }

  function markAllAsRead() {
    saveReadIds(notifications.map((notification) => notification.id));
  }

  return (
    <PageLayout>
      <section className="notifications-intro">
        <p className="small-label">STAY IN THE LOOP</p>
        <h1>Notifications</h1>
        <p>Important updates about your account and rewards.</p>
      </section>

      <div className="notifications-toolbar">
        <div
          className="notifications-filters"
          role="group"
          aria-label="Filter notifications"
        >
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={filter === category ? 'selected' : ''}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="mark-all-notifications"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      <section className="notifications-surface">
        {visibleNotifications.map((notification) => {
          const isRead = readIds.includes(notification.id);

          return (
            <article
              key={notification.id}
              className={`notification-entry ${
                isRead ? 'is-read' : ''
              }`}
            >
              <div className="notification-entry-icon">
                {notification.icon}
              </div>

              <div className="notification-entry-content">
                <strong>{notification.title}</strong>
                <p>{notification.description}</p>
                <small>
                  {notification.time} · {notification.category}
                </small>
              </div>

              {!isRead && (
                <button
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </button>
              )}
            </article>
          );
        })}
      </section>
    </PageLayout>
  );
}