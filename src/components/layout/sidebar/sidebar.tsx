import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';

const menuItems = [
  { icon: '▦', label: 'Dashboard', path: '/dashboard' },
  { icon: '▣', label: 'Wallet', path: '/wallet' },
  { icon: '⇄', label: 'Exchange', path: '/exchange' },
  { icon: '%', label: 'Cashback', path: '/cashback' },
  { icon: '☆', label: 'Rewards', path: '/rewards' },
  { icon: '◈', label: 'Drops', path: '/drops' },
  { icon: '◷', label: 'Transactions', path: '/transactions' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside
      className={`dashboard-sidebar ${isOpen ? 'mobile-open' : ''}`}
      aria-label="Navegación principal"
    >
      <button
        type="button"
        className="mobile-close-button"
        aria-label="Cerrar menú"
        onClick={onClose}
      >
        ×
      </button>

      <div className="sidebar-brand">
        <svg
          className="professional-coin-svg"
          viewBox="0 0 190 190"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo Vida Extra"
        >
          <defs>
            <linearGradient
              id="sidebarCoinShine"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fff3c4" />
              <stop offset="45%" stopColor="#f4c430" />
              <stop offset="100%" stopColor="#c8890a" />
            </linearGradient>
          </defs>

          <g transform="translate(95,95)">
            <circle r="95" fill="#8a5a00" />
            <circle
              r="88"
              fill="url(#sidebarCoinShine)"
              stroke="#7a4a00"
              strokeWidth="4"
            />
            <circle
              r="68"
              fill="none"
              stroke="#7a4a00"
              strokeWidth="3"
              strokeDasharray="4 6"
            />
            <path
              d="M -95 -30 A 95 95 0 0 1 -30 -95 L -10 -70 A 68 68 0 0 0 -70 -10 Z"
              fill="#fffce6"
              opacity="0.55"
            />
            <text
              x="0"
              y="26"
              textAnchor="middle"
              fontFamily="Sora, sans-serif"
              fontSize="80"
              fontWeight="700"
              fill="#5c3d00"
            >
              V
            </text>
          </g>
        </svg>

        <div className="sidebar-brand-text">
          <strong>
            Vida <span>Extra</span>
          </strong>
          <small>tu dinero, a otro nivel</small>
        </div>
      </div>

      <p className="sidebar-title">WORKSPACE</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink
  to="/notifications"
  onClick={onClose}
  className={({ isActive }) =>
    `sidebar-item ${isActive ? 'active' : ''}`
  }
>
  <span aria-hidden="true">◉</span>
  Notifications
</NavLink>
        <NavLink
  to="/settings"
  onClick={onClose}
  className={({ isActive }) =>
    `sidebar-item ${isActive ? 'active' : ''}`
  }
>
  <span aria-hidden="true">⚙</span>
  Settings
</NavLink>

        <button
          type="button"
          className="mobile-logout-button"
          onClick={logout}
        >
          ↪ Cerrar sesión
        </button>
      </div>
    </aside>
  );
}