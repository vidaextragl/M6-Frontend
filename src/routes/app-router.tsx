import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/auth-context';
import { DashboardPage, LoginPage, RegisterPage, TermsPage, PrivacyPage } from '../pages';
import { WorkspacePage } from '../pages/workspace-page';
import { ProtectedRoute } from './protected-route';

function PrivatePage({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivatePage>
                <DashboardPage />
              </PrivatePage>
            }
          />

          <Route
            path="/wallet"
            element={
              <PrivatePage>
                <WorkspacePage type="wallet" />
              </PrivatePage>
            }
          />

          <Route
            path="/exchange"
            element={
              <PrivatePage>
                <WorkspacePage type="exchange" />
              </PrivatePage>
            }
          />

          <Route
            path="/cashback"
            element={
              <PrivatePage>
                <WorkspacePage type="cashback" />
              </PrivatePage>
            }
          />

          <Route
            path="/rewards"
            element={
              <PrivatePage>
                <WorkspacePage type="rewards" />
              </PrivatePage>
            }
          />

          <Route
            path="/drops"
            element={
              <PrivatePage>
                <WorkspacePage type="drops" />
              </PrivatePage>
            }
          />

          <Route
            path="/transactions"
            element={
              <PrivatePage>
                <WorkspacePage type="transactions" />
              </PrivatePage>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}