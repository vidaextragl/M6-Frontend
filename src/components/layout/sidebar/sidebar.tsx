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
        <div className="professional-coin">
          <span>V</span>
        </div>

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