import { useState, useEffect } from 'react';
import { gieService, GIE, CreateGIEData, GIEStats } from '../services/gieService';

interface UseGIEReturn {
  gies: GIE[];
  currentGIE: GIE | null;
  stats: GIEStats | null;
  isLoading: boolean;
  error: string | null;
  createGIE: (gieData: CreateGIEData) => Promise<boolean>;
  updateGIE: (id: string, gieData: Partial<CreateGIEData>) => Promise<boolean>;
  deleteGIE: (id: string) => Promise<boolean>;
  getGIEById: (id: string) => Promise<void>;
  refreshGIEs: () => Promise<void>;
  getNextProtocol: () => Promise<string | null>;
  clearError: () => void;
}

export const useGIE = (): UseGIEReturn => {
  const [gies, setGies] = useState<GIE[]>([]);
  const [currentGIE, setCurrentGIE] = useState<GIE | null>(null);
  const [stats, setStats] = useState<GIEStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les GIE au montage du composant
  useEffect(() => {
    refreshGIEs();
    loadStats();
  }, []);

  const refreshGIEs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await gieService.getAllGIE();
      
      if (response.success && response.data) {
        setGies(response.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des GIE');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors du chargement des GIE');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await gieService.getGIEStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const createGIE = async (gieData: CreateGIEData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await gieService.createGIE(gieData);
      
      if (response.success && response.data) {
        setGies(prev => [...prev, response.data!]);
        setCurrentGIE(response.data);
        await loadStats(); // Mettre à jour les statistiques
        return true;
      } else {
        setError(response.message || 'Erreur lors de la création du GIE');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création du GIE');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGIE = async (id: string, gieData: Partial<CreateGIEData>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await gieService.updateGIE(id, gieData);
      
      if (response.success && response.data) {
        setGies(prev => prev.map(gie => 
          gie._id === id ? response.data! : gie
        ));
        if (currentGIE && currentGIE._id === id) {
          setCurrentGIE(response.data);
        }
        return true;
      } else {
        setError(response.message || 'Erreur lors de la mise à jour du GIE');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la mise à jour du GIE');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGIE = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await gieService.deleteGIE(id);
      
      if (response.success) {
        setGies(prev => prev.filter(gie => gie._id !== id));
        if (currentGIE && currentGIE._id === id) {
          setCurrentGIE(null);
        }
        await loadStats(); // Mettre à jour les statistiques
        return true;
      } else {
        setError(response.message || 'Erreur lors de la suppression du GIE');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la suppression du GIE');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getGIEById = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await gieService.getGIEById(id);
      
      if (response.success && response.data) {
        setCurrentGIE(response.data);
      } else {
        setError(response.message || 'GIE non trouvé');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors du chargement du GIE');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextProtocol = async (): Promise<string | null> => {
    try {
      const response = await gieService.getNextProtocol();
      if (response.success && response.data) {
        return response.data.numeroProtocole;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de protocole:', error);
      return null;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    gies,
    currentGIE,
    stats,
    isLoading,
    error,
    createGIE,
    updateGIE,
    deleteGIE,
    getGIEById,
    refreshGIEs,
    getNextProtocol,
    clearError
  };
};
