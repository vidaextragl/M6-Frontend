import type { ReactNode } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { AuthProvider } from '../context/auth-context';
import { DashboardPage, LoginPage, RegisterPage, TermsPage, PrivacyPage } from '../pages';
import { NotificationsPage } from '../pages/notifications-page';
import { SettingsPage } from '../pages/settings-page';
import { WorkspacePage } from '../pages/workspace-page';
import { ProtectedRoute } from './protected-route';
import { GuestRoute } from './guest-route';
import { Chatbot } from '../components/chatbot';

function PrivatePage({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function PublicOnlyPage({ children }: { children: ReactNode }) {
  return <GuestRoute>{children}</GuestRoute>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyPage>
                <LoginPage />
              </PublicOnlyPage>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyPage>
                <RegisterPage />
              </PublicOnlyPage>
            }
          />
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
            path="/transactions"
            element={
              <PrivatePage>
                <WorkspacePage type="transactions" />
              </PrivatePage>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivatePage>
                <NotificationsPage />
              </PrivatePage>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivatePage>
                <SettingsPage />
              </PrivatePage>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Chatbot />
      </AuthProvider>
    </BrowserRouter>
  );
}
