const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_STORAGE_KEY = 'vida-extra:token';

interface ApiErrorBody {
  error: string;
  code?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_REGISTERED: 'Ese email ya está registrado',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  MISSING_TOKEN: 'Tu sesión no es válida, iniciá sesión de nuevo',
  INVALID_TOKEN: 'Tu sesión no es válida, iniciá sesión de nuevo',
  TOKEN_EXPIRED: 'Tu sesión expiró, iniciá sesión de nuevo',
  VALIDATION_ERROR: 'Revisá los datos ingresados',
  NOT_FOUND: 'No se encontró lo que buscabas',
  WALLET_NOT_FOUND: 'No se encontró tu wallet',
  USER_NOT_FOUND: 'No se encontró el usuario',
  REWARD_NOT_FOUND: 'No se encontró esa recompensa',
  CONFLICT: 'Ya existe un registro con esos datos',
  UNAUTHORIZED: 'No tenés permiso para hacer esto',
  INSUFFICIENT_FUNDS: 'No tenés fondos suficientes',
  INSUFFICIENT_POINTS: 'No tenés puntos suficientes',
  AMOUNT_TOO_SMALL: 'El monto ingresado es demasiado chico',
  EXCHANGE_RATE_UNAVAILABLE: 'El cambio de divisas no está disponible en este momento',
  INTERNAL_ERROR: 'Ocurrió un error inesperado, intentá de nuevo',
};

function getErrorMessage(body: ApiErrorBody): string {
  if (body.code && ERROR_MESSAGES[body.code]) {
    return ERROR_MESSAGES[body.code];
  }
  return body.error || 'Ocurrió un error inesperado, intentá de nuevo';
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

interface ApiFetchOptions extends Omit<RequestInit, 'headers'> {
  skipAuth?: boolean;
  headers?: Record<string, string>;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { skipAuth, headers, ...rest } = options;
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let errorBody: ApiErrorBody;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = { error: `Error ${response.status}` };
    }
    throw new Error(getErrorMessage(errorBody));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}