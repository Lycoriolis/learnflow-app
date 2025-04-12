import { type User } from 'firebase/auth';
declare function initAuth(): import("@firebase/util").Unsubscribe | undefined;
declare function register(email: string, password: string, displayName: string): Promise<void>;
declare function login(email: string, password: string): Promise<void>;
declare function loginWithGoogle(): Promise<void>;
declare function logout(): Promise<void>;
declare function resetPassword(email: string): Promise<void>;
declare function getCurrentUser(): User | null;
export { initAuth, register, login, loginWithGoogle, logout, resetPassword, getCurrentUser };
