import apiCall, { ApiResponse } from './api';

// Interface pour les cycles d'investissement
export interface CycleInvestissement {
  _id: string;
  gie: string; // ID du GIE
  dateDebut: string;
  dateFin: string;
  dureeJours: number;
  montantObjectif: number;
  montantCollecte: number;
  pourcentageAtteint: number;
  statut: 'en_cours' | 'termine' | 'suspendu';
  wallet: {
    adresse: string;
    solde: number;
    devise: string;
    transactions: Array<{
      type: 'depot' | 'retrait' | 'transfert';
      montant: number;
      date: string;
      description: string;
      reference: string;
    }>;
  };
  participants: Array<{
    utilisateurId: string;
    montantInvesti: number;
    dateInvestissement: string;
    pourcentageParticipation: number;
  }>;
  dividendes: Array<{
    periode: string;
    montantTotal: number;
    montantParPart: number;
    dateDistribution: string;
    statut: 'calcule' | 'distribue';
  }>;
  dateCreation: string;
}

export interface CreateInvestissementData {
  gieId: string;
  montantObjectif: number;
  dateDebut?: string;
}

export interface InvestirData {
  cycleId: string;
  montant: number;
  methodePaiement: string;
}

export interface InvestissementStats {
  totalCycles: number;
  montantTotalCollecte: number;
  montantTotalObjectif: number;
  cyclesActifs: number;
  cyclesTermines: number;
  participantsUniques: number;
  rendementMoyen: number;
}

export interface WalletTransaction {
  type: 'depot' | 'retrait' | 'transfert';
  montant: number;
  date: string;
  description: string;
  reference: string;
}

export interface DividendeInfo {
  periode: string;
  montantTotal: number;
  montantParPart: number;
  dateDistribution: string;
  statut: 'calcule' | 'distribue';
}

// Service Investissement
export const investissementService = {
  // Créer un nouveau cycle d'investissement
  async createCycle(data: CreateInvestissementData): Promise<ApiResponse<CycleInvestissement>> {
    return await apiCall<CycleInvestissement>('/investissements/cycles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtenir tous les cycles d'investissement
  async getAllCycles(): Promise<ApiResponse<CycleInvestissement[]>> {
    return await apiCall<CycleInvestissement[]>('/investissements/cycles');
  },

  // Obtenir les cycles actifs
  async getCyclesActifs(): Promise<ApiResponse<CycleInvestissement[]>> {
    return await apiCall<CycleInvestissement[]>('/investissements/cycles?statut=en_cours');
  },

  // Obtenir un cycle par ID
  async getCycleById(id: string): Promise<ApiResponse<CycleInvestissement>> {
    return await apiCall<CycleInvestissement>(`/investissements/cycles/${id}`);
  },

  // Obtenir les cycles d'un GIE
  async getCyclesByGIE(gieId: string): Promise<ApiResponse<CycleInvestissement[]>> {
    return await apiCall<CycleInvestissement[]>(`/investissements/gie/${gieId}/cycles`);
  },

  // Investir dans un cycle
  async investir(data: InvestirData): Promise<ApiResponse<{
    transaction: WalletTransaction;
    cycle: CycleInvestissement;
  }>> {
    return await apiCall(`/investissements/investir`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtenir les investissements d'un utilisateur
  async getMesInvestissements(): Promise<ApiResponse<Array<{
    cycle: CycleInvestissement;
    montantInvesti: number;
    dateInvestissement: string;
    pourcentageParticipation: number;
    dividendesRecus: number;
  }>>> {
    return await apiCall('/investissements/mes-investissements');
  },

  // Obtenir les statistiques des investissements
  async getInvestissementStats(): Promise<ApiResponse<InvestissementStats>> {
    return await apiCall<InvestissementStats>('/investissements/stats');
  },

  // Calculer les dividendes pour un cycle
  async calculerDividendes(cycleId: string): Promise<ApiResponse<DividendeInfo>> {
    return await apiCall<DividendeInfo>(`/investissements/cycles/${cycleId}/dividendes`, {
      method: 'POST',
    });
  },

  // Distribuer les dividendes
  async distribuerDividendes(cycleId: string, periodeId: string): Promise<ApiResponse> {
    return await apiCall(`/investissements/cycles/${cycleId}/dividendes/${periodeId}/distribuer`, {
      method: 'POST',
    });
  },

  // Obtenir l'historique du wallet d'un GIE
  async getWalletHistory(gieId: string): Promise<ApiResponse<WalletTransaction[]>> {
    return await apiCall<WalletTransaction[]>(`/investissements/gie/${gieId}/wallet/history`);
  },

  // Obtenir le solde du wallet d'un GIE
  async getWalletBalance(gieId: string): Promise<ApiResponse<{
    solde: number;
    devise: string;
    adresse: string;
  }>> {
    return await apiCall(`/investissements/gie/${gieId}/wallet/balance`);
  },

  // Fermer un cycle d'investissement
  async fermerCycle(cycleId: string): Promise<ApiResponse<CycleInvestissement>> {
    return await apiCall<CycleInvestissement>(`/investissements/cycles/${cycleId}/fermer`, {
      method: 'PUT',
    });
  }
};
