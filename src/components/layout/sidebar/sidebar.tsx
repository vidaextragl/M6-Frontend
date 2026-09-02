import { NavLink } from 'react-router-dom';

const menuItems = [
  { icon: '▦', label: 'Dashboard', path: '/dashboard' },
  { icon: '▣', label: 'Wallet', path: '/wallet' },
  { icon: '⇄', label: 'Exchange', path: '/exchange' },
  { icon: '%', label: 'Cashback', path: '/cashback' },
  { icon: '☆', label: 'Rewards', path: '/rewards' },
  { icon: '◈', label: 'Drops', path: '/drops' },
  { icon: '◷', label: 'Transactions', path: '/transactions' },
];

export function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <svg className="professional-coin-svg" viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sidebarCoinShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3c4" />
              <stop offset="45%" stopColor="#f4c430" />
              <stop offset="100%" stopColor="#c8890a" />
            </linearGradient>
          </defs>
          <g transform="translate(95,95)">
            <circle r="95" fill="#8a5a00" />
            <circle r="88" fill="url(#sidebarCoinShine)" stroke="#7a4a00" strokeWidth="4" />
            <circle r="68" fill="none" stroke="#7a4a00" strokeWidth="3" strokeDasharray="4 6" />
            <path d="M -95 -30 A 95 95 0 0 1 -30 -95 L -10 -70 A 68 68 0 0 0 -70 -10 Z" fill="#fffce6" opacity="0.55" />
            <text x="0" y="26" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="80" fontWeight="700" fill="#5c3d00">V</text>
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
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button">◉ Notifications</button>
        <button type="button">⚙ Settings</button>
      </div>
    </aside>
  );
}