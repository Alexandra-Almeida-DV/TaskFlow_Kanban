import { createContext } from 'react';

export interface User {
  id: number;
  email: string;
  full_name: string;
  display_name?: string;
  photo_url?: string;
}

export interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  login(token: string, userData: User): Promise<void>;
  logout(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);