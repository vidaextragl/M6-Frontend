import { useEffect, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar } from '../navbar';
import { Sidebar } from '../sidebar';
import '../../../styles/mobile-responsive.css';

interface PageLayoutProps {
  children: ReactNode;
}

const mobileItems = [
  { icon: '▦', label: 'Dashboard', path: '/dashboard' },
  { icon: '▣', label: 'Wallet', path: '/wallet' },
  { icon: '⇄', label: 'Exchange', path: '/exchange' },
  { icon: '%', label: 'Cashback', path: '/cashback' },
  { icon: '☆', label: 'Rewards', path: '/rewards' },
];

export function PageLayout({ children }: PageLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeWithEscape);
    };
  }, [menuOpen]);

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {menuOpen && (
        <button
          type="button"
          className="mobile-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="app-main">
        <Navbar onOpenMenu={() => setMenuOpen(true)} />

        <main className="dashboard-content">
          {children}
        </main>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Navegación móvil">
        {mobileItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}