import { useState } from 'react';

interface PayeurInfo {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
}

interface CreerPaiementOptions {
  montant: number;
  typePaiement: 'adhesion_gie' | 'investissement' | 'cotisation' | 'service' | 'autre';
  entiteId: string;
  typeEntite: 'GIE' | 'CycleInvestissement' | 'Adhesion' | 'Utilisateur';
  payeur: PayeurInfo;
  methodePaiement?: 'wave' | 'orange_money' | 'free_money';
  metadonnees?: any;
}

interface Paiement {
  _id: string;
  referencePaiement: string;
  montant: number;
  devise: string;
  statut: string;
  typePaiement: string;
  methodePaiement: string;
  payeur: PayeurInfo;
  dateCreation: string;
  datePaiement?: string;
  donneesWave?: any;
}

export const usePaiement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const creerPaiement = async (options: CreerPaiementOptions): Promise<{ success: boolean; data?: any; urlPaiement?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch('http://localhost:5000/api/paiements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          montant: options.montant,
          typePaiement: options.typePaiement,
          entiteId: options.entiteId,
          typeEntite: options.typeEntite,
          payeur: options.payeur,
          methodePaiement: options.methodePaiement || 'wave',
          metadonnees: options.metadonnees || {}
        })
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data.paiement,
          urlPaiement: data.data.urlPaiement
        };
      } else {
        setError(data.message || 'Erreur lors de la création du paiement');
        return {
          success: false
        };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de connexion au serveur';
      setError(errorMessage);
      return {
        success: false
      };
    } finally {
      setLoading(false);
    }
  };

  const obtenirPaiement = async (paiementId: string): Promise<{ success: boolean; data?: Paiement }> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/paiements/${paiementId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data.paiement
        };
      } else {
        setError(data.message);
        return {
          success: false
        };
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      return {
        success: false
      };
    } finally {
      setLoading(false);
    }
  };

  const obtenirPaiementParReference = async (reference: string): Promise<{ success: boolean; data?: Paiement }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/paiements/reference/${reference}`);
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data.paiement
        };
      } else {
        setError(data.message);
        return {
          success: false
        };
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      return {
        success: false
      };
    } finally {
      setLoading(false);
    }
  };

  const verifierStatutPaiement = async (paiementId: string): Promise<{ success: boolean; data?: Paiement }> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/paiements/${paiementId}/verifier-statut`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data.paiement
        };
      } else {
        setError(data.message);
        return {
          success: false
        };
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      return {
        success: false
      };
    } finally {
      setLoading(false);
    }
  };

  const annulerPaiement = async (paiementId: string): Promise<{ success: boolean; data?: Paiement }> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/paiements/${paiementId}/annuler`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data.paiement
        };
      } else {
        setError(data.message);
        return {
          success: false
        };
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      return {
        success: false
      };
    } finally {
      setLoading(false);
    }
  };

  const listerPaiements = async (filtres?: {
    page?: number;
    limite?: number;
    statut?: string;
    typePaiement?: string;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<{ success: boolean; data?: { paiements: Paiement[]; pagination: any } }> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (filtres?.page) params.append('page', filtres.page.toString());
      if (filtres?.limite) params.append('limite', filtres.limite.toString());
      if (filtres?.statut) params.append('statut', filtres.statut);
      if (filtres?.typePaiement) params.append('typePaiement', filtres.typePaiement);
      if (filtres?.dateDebut) params.append('dateDebut', filtres.dateDebut);
      if (filtres?.dateFin) params.append('dateFin', filtres.dateFin);

      const response = await fetch(`http://localhost:5000/api/paiements?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      } else {
        setError(data.message);
        return {
          success: false
        };
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      return {
        success: false
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    creerPaiement,
    obtenirPaiement,
    obtenirPaiementParReference,
    verifierStatutPaiement,
    annulerPaiement,
    listerPaiements
  };
};
