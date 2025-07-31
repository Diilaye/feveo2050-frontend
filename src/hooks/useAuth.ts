import { useState, useEffect } from 'react';
import { authService, User, LoginData, RegisterData } from '../services/authService';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginData) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  error: string | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            // Optionnel: vérifier que le token est toujours valide
            try {
              const response = await authService.getProfile();
              if (response.success && response.data) {
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
              }
            } catch (error) {
              // Token invalide, déconnecter
              console.warn('Token expiré ou invalide, déconnexion automatique');
              authService.logout();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        // Nettoyer le localStorage en cas d'erreur
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.message || 'Erreur de connexion');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.message || 'Erreur d\'inscription');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Erreur d\'inscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.updateProfile(userData);
      
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return true;
      } else {
        setError(response.message || 'Erreur de mise à jour');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de mise à jour');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    error,
    clearError
  };
};
