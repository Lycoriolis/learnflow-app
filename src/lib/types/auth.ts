import type { User } from 'firebase/auth';

export interface Locals {
    user: User | null;
    isAuthenticated: boolean;
    [key: string]: any;
}

export interface AuthenticatedLocals extends Locals {
    user: User;
    isAuthenticated: true;
}
