import { useState } from 'react';
import { PageLayout } from '../components/layout/page-layout';
import { useAuth } from '../hooks/use-auth';
import '../styles/settings-page.css';

function getSavedPreference(key: string) {
  return localStorage.getItem(key) !== 'false';
}

export function SettingsPage() {
  const { user, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  const [fullName, setFullName] = useState(
    () =>
      localStorage.getItem('vida-extra:profile-name') ??
      user?.name ??
      'Usuario',
  );

  const [mainCurrency, setMainCurrency] = useState(
    () => localStorage.getItem('vida-extra:main-currency') ?? 'ARS',
  );

  const [pushNotifications, setPushNotifications] = useState(() =>
    getSavedPreference('vida-extra:push-notifications'),
  );

  const [emailNotifications, setEmailNotifications] = useState(() =>
    getSavedPreference('vida-extra:email-notifications'),
  );

  const [exchangeAlerts, setExchangeAlerts] = useState(() =>
    getSavedPreference('vida-extra:exchange-alerts'),
  );

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  function showMessage(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2500);
  }

  function editOrSaveProfile() {
    if (!editing) {
      setEditing(true);
      return;
    }

    localStorage.setItem('vida-extra:profile-name', fullName);
    setEditing(false);
    showMessage('Profile saved successfully.');
  }

  function changeCurrency(value: string) {
    setMainCurrency(value);
    localStorage.setItem('vida-extra:main-currency', value);
    showMessage('Main currency updated.');
  }

  function togglePushNotifications() {
    const nextValue = !pushNotifications;
    setPushNotifications(nextValue);

    localStorage.setItem(
      'vida-extra:push-notifications',
      String(nextValue),
    );
  }

  function toggleEmailNotifications() {
    const nextValue = !emailNotifications;
    setEmailNotifications(nextValue);

    localStorage.setItem(
      'vida-extra:email-notifications',
      String(nextValue),
    );
  }

  function toggleExchangeAlerts() {
    const nextValue = !exchangeAlerts;
    setExchangeAlerts(nextValue);

    localStorage.setItem(
      'vida-extra:exchange-alerts',
      String(nextValue),
    );
  }

  return (
    <PageLayout>
      <section className="settings-intro">
        <p className="small-label">MAKE IT YOURS</p>
        <h1>Settings</h1>
        <p>Manage your profile, preferences, and security.</p>
      </section>

      <div className="settings-page-grid">
        <section className="settings-surface settings-profile-card">
          <h2>Profile</h2>

          <div className="settings-profile-heading">
            <div className="settings-page-avatar">
              {initials || 'U'}
            </div>

            <div className="settings-profile-data">
              <h3>{fullName}</h3>
              <p>{user?.email ?? 'Email unavailable'}</p>
            </div>

            <button type="button" onClick={editOrSaveProfile}>
              {editing ? 'Save profile' : 'Edit profile'}
            </button>
          </div>

          <div className="settings-profile-fields">
            <label>
              Full name
              <input
                value={fullName}
                readOnly={!editing}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>

            <label>
              Email address
              <input value={user?.email ?? ''} readOnly />
            </label>

            <label className="settings-currency-field">
              Main currency
              <select
                value={mainCurrency}
                onChange={(event) => changeCurrency(event.target.value)}
              >
                <option value="ARS">ARS — Argentine Peso</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="BRL">BRL — Brazilian Real</option>
              </select>
            </label>
          </div>
        </section>

        <section className="settings-surface settings-preferences-card">
          <h2>Notifications</h2>

          <div className="settings-preference-row">
            <span>
              <strong>Push notifications</strong>
              <small>Get updates directly on your device.</small>
            </span>

            <button
              type="button"
              role="switch"
              aria-label="Push notifications"
              aria-checked={pushNotifications}
              className={`settings-switch ${
                pushNotifications ? 'enabled' : ''
              }`}
              onClick={togglePushNotifications}
            >
              <span />
            </button>
          </div>

          <div className="settings-preference-row">
            <span>
              <strong>Email notifications</strong>
              <small>Receive a weekly account summary.</small>
            </span>

            <button
              type="button"
              role="switch"
              aria-label="Email notifications"
              aria-checked={emailNotifications}
              className={`settings-switch ${
                emailNotifications ? 'enabled' : ''
              }`}
              onClick={toggleEmailNotifications}
            >
              <span />
            </button>
          </div>

          <div className="settings-preference-row">
            <span>
              <strong>Exchange alerts</strong>
              <small>Be notified when targets are reached.</small>
            </span>

            <button
              type="button"
              role="switch"
              aria-label="Exchange alerts"
              aria-checked={exchangeAlerts}
              className={`settings-switch ${
                exchangeAlerts ? 'enabled' : ''
              }`}
              onClick={toggleExchangeAlerts}
            >
              <span />
            </button>
          </div>
        </section>

        <section className="settings-surface settings-security-card">
          <h2>Security</h2>

          <div className="settings-security-actions">
            <button
              type="button"
              onClick={() =>
                showMessage(
                  'Password changes require a backend connection.',
                )
              }
            >
              <span>⌁</span>
              Change password
            </button>

            <button
              type="button"
              onClick={() =>
                showMessage('You currently have one active session.')
              }
            >
              <span>◉</span>
              Active sessions
            </button>

            <button
              type="button"
              className="settings-logout-action"
              onClick={logout}
            >
              <span>↪</span>
              Log out
            </button>
          </div>
        </section>
      </div>

      {message && (
        <div className="settings-status-message" role="status">
          ✓ {message}
        </div>
      )}
    </PageLayout>
  );
}