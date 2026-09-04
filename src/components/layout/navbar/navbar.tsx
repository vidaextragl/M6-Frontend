import { useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';
import { useTheme } from '../../../hooks/use-theme';
import '../../../styles/navbar-features.css';

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/wallet': 'Wallet',
  '/exchange': 'Exchange',
  '/cashback': 'Cashback',
  '/rewards': 'Rewards',
  '/drops': 'Drops',
  '/transactions': 'Transactions',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

interface NavbarProps {
  onOpenMenu: () => void;
}

export function Navbar({ onOpenMenu }: NavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const currentPage = pageNames[location.pathname] ?? 'Vida Extra';

  const initials = (user?.name ?? 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return Object.entries(pageNames).filter(([, pageName]) =>
      pageName.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  function openResult(path: string) {
    navigate(path);
    setQuery('');
    setMobileSearchOpen(false);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (searchResults[0]) {
      openResult(searchResults[0][0]);
    }
  }

  function renderSearchResults() {
    if (!query.trim()) {
      return null;
    }

    return (
      <div className="navbar-search-results">
        {searchResults.length > 0 ? (
          searchResults.map(([path, pageName]) => (
            <button
              type="button"
              key={path}
              onClick={() => openResult(path)}
            >
              {pageName}
            </button>
          ))
        ) : (
          <p>No encontramos esa sección.</p>
        )}
      </div>
    );
  }

  return (
    <header className="dashboard-navbar">
      <div className="navbar-heading">
        <p>OVERVIEW</p>
        <strong>{currentPage}</strong>
      </div>

      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Abrir menú"
        onClick={onOpenMenu}
      >
        ☰
      </button>

      <div className="navbar-right">
        <form
          className="search-box"
          role="search"
          onSubmit={submitSearch}
        >
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            placeholder="Search anything"
            aria-label="Buscar sección"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {renderSearchResults()}
        </form>

        <button
          type="button"
          className="navbar-icon mobile-search-button"
          aria-label="Abrir buscador"
          onClick={() => setMobileSearchOpen((isOpen) => !isOpen)}
        >
          ⌕
        </button>

        <button
          type="button"
          className="navbar-icon"
          aria-label={
            theme === 'light'
              ? 'Cambiar a modo oscuro'
              : 'Cambiar a modo claro'
          }
          title={theme === 'light' ? 'Modo claro' : 'Modo oscuro'}
          onClick={toggleTheme}
        >
          {theme === 'light' ? '☀️' : '🌙'}
        </button>

        <button
  type="button"
  className="navbar-icon"
  aria-label="Notifications"
  onClick={() => navigate('/notifications')}
>
  🔔
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

      {mobileSearchOpen && (
        <form
          className="mobile-search-panel"
          role="search"
          onSubmit={submitSearch}
        >
          <input
            autoFocus
            type="search"
            placeholder="Buscar una sección"
            aria-label="Buscar sección"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <button
            type="button"
            aria-label="Cerrar buscador"
            onClick={() => {
              setMobileSearchOpen(false);
              setQuery('');
            }}
          >
            ×
          </button>

          {renderSearchResults()}
        </form>
      )}
    </header>
  );
}