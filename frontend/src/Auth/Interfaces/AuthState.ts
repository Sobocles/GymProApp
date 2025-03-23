import { UserInterface } from "../../Auth/Interfaces/UserInterface";


export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  user: UserInterface | null;
  isAuth: boolean;
  isAdmin: boolean;
  trainer?: boolean;
  roles: string[]; 
  token: string | null;
  profileImageUrl?: string; 
  errorMessage?: string;
}

