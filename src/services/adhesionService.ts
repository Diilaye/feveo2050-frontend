import apiCall, { ApiResponse } from './api';

// Interface pour les adhésions
export interface Adhesion {
  _id: string;
  gie: string; // ID du GIE
  numeroAdhesion: string;
  localisation: {
    region: string;
    departement: string;
    arrondissement: string;
    commune: string;
    codeRegion: string;
    codeDepartement: string;
    codeArrondissement: string;
    codeCommune: string;
    numeroListe: string;
  };
  immatriculation: {
    immatricule: boolean;
    numeroRegistre?: string;
  };
  presidente: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    cin: {
      numero: string;
      dateDelivrance: string;
      dateValidite: string;
    };
    telephone: string;
  };
  activites: {
    liste: string[];
    autres?: string;
    secteurs: {
      agriculture: boolean;
      elevage: boolean;
      transformation: boolean;
      commerceDistribution: boolean;
    };
  };
  coordinateur: {
    nom: string;
    matricule: string;
  };
  workflow: {
    etapeActuelle: 'soumise' | 'documents_requis' | 'validation_en_cours' | 'validee' | 'rejetee';
    documentsRequis: string[];
    documentsReçus: string[];
    commentaires?: string;
    dateValidation?: string;
    validateurId?: string;
  };
  paiement: {
    statut: 'en_attente' | 'effectue' | 'confirme';
    montant?: number;
    datePaiement?: string;
    methodePaiement?: string;
    referenceTransaction?: string;
  };
  dateCreation: string;
  dateSignature: string;
  statut: 'active' | 'inactive' | 'suspendue';
}

export interface CreateAdhesionData {
  numeroAdhesion: string;
  localisation: {
    region: string;
    departement: string;
    arrondissement: string;
    commune: string;
    codeRegion: string;
    codeDepartement: string;
    codeArrondissement: string;
    codeCommune: string;
    numeroListe: string;
  };
  immatriculation: {
    immatricule: boolean;
    numeroRegistre?: string;
  };
  presidente: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    cin: {
      numero: string;
      dateDelivrance: string;
      dateValidite: string;
    };
    telephone: string;
  };
  activites: {
    liste: string[];
    autres?: string;
    secteurs: {
      agriculture: boolean;
      elevage: boolean;
      transformation: boolean;
      commerceDistribution: boolean;
    };
  };
  coordinateur: {
    nom: string;
    matricule: string;
  };
  dateSignature: string;
}

export interface AdhesionStats {
  total: number;
  parStatut: {
    [key: string]: number;
  };
  parRegion: {
    [key: string]: number;
  };
  parEtape: {
    [key: string]: number;
  };
  progression: {
    validees: number;
    enAttente: number;
    rejetees: number;
  };
}

export interface ProgressionData {
  etapeActuelle: string;
  pourcentageComplete: number;
  prochaineMission?: string;
  tempsRestant?: string;
}

// Service Adhésion
export const adhesionService = {
  // Créer une nouvelle adhésion
  async createAdhesion(gieId: string, adhesionData: CreateAdhesionData): Promise<ApiResponse<Adhesion>> {
    return await apiCall<Adhesion>(`/gie/${gieId}/adhesion`, {
      method: 'POST',
      body: JSON.stringify(adhesionData),
    });
  },

  // Obtenir toutes les adhésions
  async getAllAdhesions(): Promise<ApiResponse<Adhesion[]>> {
    return await apiCall<Adhesion[]>('/adhesions');
  },

  // Obtenir une adhésion par ID
  async getAdhesionById(id: string): Promise<ApiResponse<Adhesion>> {
    return await apiCall<Adhesion>(`/adhesions/${id}`);
  },

  // Obtenir l'adhésion d'un GIE
  async getAdhesionByGIE(gieId: string): Promise<ApiResponse<Adhesion>> {
    return await apiCall<Adhesion>(`/adhesions/gie/${gieId}`);
  },

  // Mettre à jour le statut de validation
  async updateValidationStatus(
    id: string,
    data: {
      statut: 'validee' | 'rejetee' | 'documents_requis';
      commentaires?: string;
      documentsRequis?: string[];
    }
  ): Promise<ApiResponse<Adhesion>> {
    return await apiCall<Adhesion>(`/adhesions/${id}/validation`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Mettre à jour le statut de paiement
  async updatePaiementStatus(
    id: string,
    data: {
      statut: 'effectue' | 'confirme';
      montant?: number;
      methodePaiement?: string;
      referenceTransaction?: string;
    }
  ): Promise<ApiResponse<Adhesion>> {
    return await apiCall<Adhesion>(`/adhesions/${id}/paiement`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Obtenir les statistiques des adhésions
  async getAdhesionStats(): Promise<ApiResponse<AdhesionStats>> {
    return await apiCall<AdhesionStats>('/adhesions/stats');
  },

  // Obtenir la progression d'une adhésion
  async getProgression(id: string): Promise<ApiResponse<ProgressionData>> {
    return await apiCall<ProgressionData>(`/adhesions/${id}/progression`);
  }
};
