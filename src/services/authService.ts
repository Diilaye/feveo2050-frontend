import apiCall, { ApiResponse } from './api';

// Interfaces pour l'authentification
export interface LoginData {
  email: string;
  motDePasse: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  role?: string;
}

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  permissions: string[];
  statut: string;
  dateCreation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Service d'authentification
export const authService = {
  // Connexion
  async login(credentials: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);

    // Sauvegarder le token
    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Inscription
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);

    // Sauvegarder le token après inscription
    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Obtenir le profil
  async getProfile(): Promise<ApiResponse<User>> {
    return await apiCall<User>('/auth/profile');
  },

  // Mettre à jour le profil
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return await apiCall<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Changer le mot de passe
  async changePassword(data: { 
    ancienMotDePasse: string; 
    nouveauMotDePasse: string; 
  }): Promise<ApiResponse> {
    return await apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user');
    if (!userData || userData === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Erreur lors du parsing de userData:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  // Obtenir le token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
};
