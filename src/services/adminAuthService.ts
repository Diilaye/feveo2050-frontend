import apiCall, { ApiResponse } from './api';

// Interface pour l'authentification admin
export interface AdminLoginData {
  email: string;
  motDePasse: string;
}

export interface AdminUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AdminAuthResponse {
  utilisateur: AdminUser;
  token: string;
}

// Service d'authentification admin
export const adminAuthService = {
  // Connexion admin
  async login(credentials: AdminLoginData): Promise<ApiResponse<AdminAuthResponse>> {
    const response = await apiCall<AdminAuthResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);

    // Sauvegarder le token admin
    if (response.success && response.data?.token) {
      localStorage.setItem('adminAuthToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.utilisateur));
    }

    return response;
  },

  // Déconnexion admin
  async logout(): Promise<void> {
    try {
      // Nettoyer le stockage local admin
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('adminUser');
    } catch (error) {
      console.error('Erreur lors de la déconnexion admin:', error);
    }
  },

  // Vérifier si l'administrateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('adminAuthToken');
  },

  // Obtenir l'administrateur actuel
  getCurrentAdmin(): AdminUser | null {
    const adminData = localStorage.getItem('adminUser');
    if (!adminData || adminData === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(adminData);
    } catch (error) {
      console.error('Erreur lors du parsing de adminUser:', error);
      localStorage.removeItem('adminUser');
      return null;
    }
  },

  // Obtenir le token admin
  getToken(): string | null {
    return localStorage.getItem('adminAuthToken');
  }
};
