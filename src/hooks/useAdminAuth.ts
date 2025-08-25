import { useState, useEffect } from 'react';
import { adminAuthService, AdminUser, AdminLoginData } from '../services/adminAuthService';

interface UseAdminAuthReturn {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminLoginData) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'administrateur est déjà connecté au chargement
    const initAdminAuth = async () => {
      try {
        if (adminAuthService.isAuthenticated()) {
          const currentAdmin = adminAuthService.getCurrentAdmin();
          if (currentAdmin) {
            setAdmin(currentAdmin);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth admin:', error);
        // Nettoyer le localStorage en cas d'erreur
        adminAuthService.logout();
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAdminAuth();
  }, []);

  const login = async (credentials: AdminLoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await adminAuthService.login(credentials);
      
      if (response.success && response.data) {
        setAdmin(response.data.utilisateur);
        return true;
      } else {
        setError(response.message || 'Erreur de connexion administrateur');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion administrateur');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    adminAuthService.logout();
    setAdmin(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    error,
    clearError
  };
};
