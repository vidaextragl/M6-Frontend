import type { ReactNode } from 'react';
import { Navbar } from '../navbar';
import { Sidebar } from '../sidebar';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Navbar />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}