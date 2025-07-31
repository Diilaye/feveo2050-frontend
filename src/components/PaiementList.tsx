import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, CreditCard, Eye } from 'lucide-react';

interface Paiement {
  _id: string;
  referencePaiement: string;
  montant: number;
  devise: string;
  statut: 'en_attente' | 'en_cours' | 'reussi' | 'echoue' | 'annule' | 'rembourse';
  typePaiement: string;
  methodePaiement: string;
  payeur: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
  dateCreation: string;
  datePaiement?: string;
  donneesWave?: any;
}

interface PaiementListProps {
  utilisateurId?: string;
  filtres?: {
    statut?: string;
    typePaiement?: string;
    dateDebut?: string;
    dateFin?: string;
  };
}

const PaiementList: React.FC<PaiementListProps> = ({ utilisateurId, filtres }) => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);

  useEffect(() => {
    chargerPaiements();
  }, [page, filtres]);

  const chargerPaiements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limite: '10'
      });

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
        setPaiements(data.data.paiements);
        setTotalPages(data.data.pagination.pages);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const verifierStatut = async (paiementId: string) => {
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
        // Actualiser la liste
        chargerPaiements();
      }
    } catch (err) {
      console.error('Erreur vérification statut:', err);
    }
  };

  const annulerPaiement = async (paiementId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce paiement ?')) {
      return;
    }

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
        chargerPaiements();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Erreur lors de l\'annulation');
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'reussi':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'echoue':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'en_cours':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'en_attente':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'annule':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatutLabel = (statut: string) => {
    const labels = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'reussi': 'Réussi',
      'echoue': 'Échoué',
      'annule': 'Annulé',
      'rembourse': 'Remboursé'
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const getStatutColor = (statut: string) => {
    const colors = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'en_cours': 'bg-blue-100 text-blue-800',
      'reussi': 'bg-green-100 text-green-800',
      'echoue': 'bg-red-100 text-red-800',
      'annule': 'bg-gray-100 text-gray-800',
      'rembourse': 'bg-purple-100 text-purple-800'
    };
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="animate-spin h-6 w-6 mr-2" />
        Chargement des paiements...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={chargerPaiements}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Historique des paiements</h2>
        <button
          onClick={chargerPaiements}
          className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Actualiser
        </button>
      </div>

      {/* Liste des paiements */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {paiements.length === 0 ? (
          <div className="text-center p-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun paiement trouvé</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {paiements.map((paiement) => (
              <li key={paiement._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {getStatutIcon(paiement.statut)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {paiement.referencePaiement}
                        </p>
                        <p className="text-sm text-gray-500">
                          {paiement.payeur.prenom} {paiement.payeur.nom}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {paiement.montant.toLocaleString()} {paiement.devise}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {paiement.typePaiement.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(paiement.statut)}`}>
                          {getStatutLabel(paiement.statut)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    {/* Bouton voir détails */}
                    <button
                      onClick={() => setSelectedPaiement(paiement)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {/* Bouton vérifier statut pour Wave */}
                    {paiement.methodePaiement === 'wave' && ['en_cours', 'en_attente'].includes(paiement.statut) && (
                      <button
                        onClick={() => verifierStatut(paiement._id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    
                    {/* Bouton annuler */}
                    {['en_attente', 'en_cours'].includes(paiement.statut) && (
                      <button
                        onClick={() => annulerPaiement(paiement._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  Créé le {new Date(paiement.dateCreation).toLocaleDateString('fr-FR')} à {new Date(paiement.dateCreation).toLocaleTimeString('fr-FR')}
                  {paiement.datePaiement && (
                    <span> • Payé le {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Précédent
          </button>
          
          <span className="text-sm text-gray-700">
            Page {page} sur {totalPages}
          </span>
          
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Modal détails paiement */}
      {selectedPaiement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Détails du paiement
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Référence</label>
                  <p className="text-sm">{selectedPaiement.referencePaiement}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Montant</label>
                  <p className="text-sm">{selectedPaiement.montant.toLocaleString()} {selectedPaiement.devise}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(selectedPaiement.statut)}`}>
                    {getStatutLabel(selectedPaiement.statut)}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Payeur</label>
                  <p className="text-sm">{selectedPaiement.payeur.prenom} {selectedPaiement.payeur.nom}</p>
                  <p className="text-xs text-gray-500">{selectedPaiement.payeur.email}</p>
                  <p className="text-xs text-gray-500">{selectedPaiement.payeur.telephone}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Méthode</label>
                  <p className="text-sm">{selectedPaiement.methodePaiement}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPaiement(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaiementList;
