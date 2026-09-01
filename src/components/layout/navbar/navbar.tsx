import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/wallet': 'Wallet',
  '/exchange': 'Exchange',
  '/cashback': 'Cashback',
  '/rewards': 'Rewards',
  '/drops': 'Drops',
  '/transactions': 'Transactions',
};

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const currentPage = pageNames[location.pathname] ?? 'Vida Extra';

  const initials = (user?.name ?? 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  return (
    <header className="dashboard-navbar">
      <div>
        <p>OVERVIEW</p>
        <strong>{currentPage}</strong>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <span>⌕</span>
          <input type="text" placeholder="Search anything" />
        </div>

        <button type="button" className="navbar-icon" aria-label="Theme">
          ☼
        </button>

        <button type="button" className="navbar-icon" aria-label="Notifications">
          ♡
        </button>

        <div className="navbar-profile">
          <div className="user-avatar">{initials}</div>

          <div className="navbar-user-name">
            <strong>{user?.name}</strong>
            <span>Personal account</span>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}