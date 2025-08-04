import apiCall, { ApiResponse } from './api';

// Interface pour les GIE
export interface GIE {
  _id: string;
  numeroProtocole: string;
  nomGIE: string;
  presidenteNom: string;
  presidentePrenom: string;
  adresse: {
    region: string;
    departement: string;
    arrondissement: string;
    commune: string;
    village?: string;
  };
  contact: {
    telephone: string;
    email?: string;
  };
  activites: string[];
  autresActivites?: string;
  nomCoordinateur: string;
  matriculeCoordinateur: string;
  immatricule: boolean;
  numeroRegistre?: string;
  dateCreation: string;
  statut: string;
  documentWorkflow?: {
    etapeActuelle: string;
    documentsRequis: string[];
    documentsReçus: string[];
    historique: Array<{
      action: string;
      effectuePar: string;
      date: string;
      commentaire?: string;
    }>;
  };
}

export interface CreateGIEData {
  nomGIE: string;
  presidenteNom: string;
  presidentePrenom: string;
  adresse: {
    region: string;
    departement: string;
    arrondissement: string;
    commune: string;
    village?: string;
  };
  contact: {
    telephone: string;
    email?: string;
  };
  activites: string[];
  autresActivites?: string;
  nomCoordinateur: string;
  matriculeCoordinateur: string;
  immatricule: boolean;
  numeroRegistre?: string;
}

export interface GIEStats {
  total: number;
  parStatut: {
    [key: string]: number;
  };
  parRegion: {
    [key: string]: number;
  };
  parActivite: {
    [key: string]: number;
  };
}

// Interface pour les statistiques publiques
export interface StatsPubliques {
  totalGIEs: number;
  totalMembres: number;
  estimations: {
    femmes: number;
    jeunes: number;
    adultes: number;
  };
  joursInvestissement: number;
  repartition: {
    regions: { _id: string; count: number }[];
    secteurs: { _id: string; count: number }[];
  };
  derniereMiseAJour: string;
}

// Service GIE
export const gieService = {
  // Créer un nouveau GIE
  async createGIE(gieData: CreateGIEData): Promise<ApiResponse<GIE>> {
    return await apiCall<GIE>('/gie', {
      method: 'POST',
      body: JSON.stringify(gieData),
    });
  },

  // Obtenir tous les GIE
  async getAllGIE(): Promise<ApiResponse<GIE[]>> {
    return await apiCall<GIE[]>('/gie');
  },

  // Obtenir un GIE par ID
  async getGIEById(id: string): Promise<ApiResponse<GIE>> {
    return await apiCall<GIE>(`/gie/${id}`);
  },

  // Mettre à jour un GIE
  async updateGIE(id: string, gieData: Partial<CreateGIEData>): Promise<ApiResponse<GIE>> {
    return await apiCall<GIE>(`/gie/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gieData),
    });
  },

  // Supprimer un GIE
  async deleteGIE(id: string): Promise<ApiResponse> {
    return await apiCall(`/gie/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtenir les statistiques des GIE
  async getGIEStats(): Promise<ApiResponse<GIEStats>> {
    return await apiCall<GIEStats>('/gie/stats');
  },

  // Obtenir le prochain numéro de protocole
  async getNextProtocol(): Promise<ApiResponse<{ numeroProtocole: string }>> {
    return await apiCall<{ numeroProtocole: string }>('/gie/next-protocol');
  },

  // Obtenir les statistiques publiques (sans authentification)
  async getStatsPubliques(): Promise<StatsPubliques> {
    const response = await fetch('http://localhost:4320/api/gie/stats-publiques', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Erreur lors de la récupération des statistiques');
    }

    return result.data;
  }
};
