import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/user.types';


const MOCK_DELAY_MS = 600;

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateMockToken(userId: string): string {
    return `mock-jwt.${userId}.${Date.now()}`;
}

const mockUsersDb: Array<User & { password: string }> = [];

async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay(MOCK_DELAY_MS);

    const existingUser = mockUsersDb.find((u) => u.email === credentials.email);
    if (existingUser) {
    throw new Error('Ese email ya está registrado');
    }

    const newUser: User & { password: string } = {
    id: crypto.randomUUID(),
    email: credentials.email,
    name: credentials.name,
    password: credentials.password,
    createdAt: new Date().toISOString(),
    };

    mockUsersDb.push(newUser);

   const user: User = {
   id: newUser.id,
   email: newUser.email,
   name: newUser.name,
   createdAt: newUser.createdAt,
};
    return { user, token: generateMockToken(user.id) };
}

async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(MOCK_DELAY_MS);

    const found = mockUsersDb.find(
    (u) => u.email === credentials.email && u.password === credentials.password,
    );

    if (!found) {
    throw new Error('Email o contraseña incorrectos');
    }

    const user: User = {
   id: found.id,
   email: found.email,
   name: found.name,
   createdAt: found.createdAt,
};
    return { user, token: generateMockToken(user.id) };
}

export const authApi = {
    register,
    login,
};