import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminUser, AdminLoginData } from '../services/adminAuthService';

// Interface pour le contexte d'authentification admin
interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminLoginData) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

// Création du contexte avec une valeur par défaut
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Props pour le fournisseur de contexte
interface AdminAuthProviderProps {
  children: ReactNode;
}

// Fournisseur de contexte
export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const auth = useAdminAuth();
  
  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification admin
export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuthContext doit être utilisé avec AdminAuthProvider');
  }
  return context;
};
