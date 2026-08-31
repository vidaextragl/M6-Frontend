import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/auth-context';
import { useAuth } from '../hooks/use-auth';
import { LoginPage } from '../pages/login-page';
import { RegisterPage } from '../pages/register-page';
import { ProtectedRoute } from './protected-route';

function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard (próximamente)</h1>
      <p>Hola, {user?.name}</p>
      <button type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPlaceholder />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}