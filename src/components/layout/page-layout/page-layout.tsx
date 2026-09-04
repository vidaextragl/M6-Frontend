import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { RouteSkeleton } from '../../ui/route-skeleton/route-skeleton';
import { Navbar } from '../navbar';
import { Sidebar } from '../sidebar';
import '../../../styles/mobile-responsive.css';

interface PageLayoutProps {
  children: ReactNode;
}

interface RouteContentProps {
  children: ReactNode;
  pathname: string;
}

const mobileItems = [
  { icon: '▦', label: 'Dashboard', path: '/dashboard' },
  { icon: '▣', label: 'Wallet', path: '/wallet' },
  { icon: '⇄', label: 'Exchange', path: '/exchange' },
  { icon: '%', label: 'Cashback', path: '/cashback' },
  { icon: '☆', label: 'Rewards', path: '/rewards' },
];

function RouteContent({ children, pathname }: RouteContentProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return <RouteSkeleton pathname={pathname} />;
  }

  return children;
}

export function PageLayout({ children }: PageLayoutProps) {
  const location = useLocation();
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
          <RouteContent
            key={location.pathname}
            pathname={location.pathname}
          >
            {children}
          </RouteContent>
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