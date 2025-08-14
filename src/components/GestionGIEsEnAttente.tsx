import React, { useState, useEffect } from 'react';
import { gieService, GIE } from '../services/gieService';

interface GIEAvecAdhesion extends GIE {
  presidenteTelephone?: string;
  nombreMembres?: number;
  secteurActivite?: string;
  description?: string;
  objectifs?: string[];
  besoinsFinancement?: number;
  statutEnregistrement?: string;
  adhesion?: {
    _id: string;
    montantAdhesion: number;
    validation: {
      statut: string;
      dateValidation?: string;
    };
    paiement: {
      statut: string;
      montantPaye?: number;
      datePaiement?: string;
      referenceTransaction?: string;
      methodePaiement?: string;
    };
  };
}

const GestionGIEsEnAttente: React.FC = () => {
  const [giesEnAttente, setGiesEnAttente] = useState<GIEAvecAdhesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationLoading, setValidationLoading] = useState<string | null>(null);

  const [paiementData, setPaiementData] = useState<{
    [key: string]: {
      montantPaye: number;
      referenceTransaction: string;
      methodePaiement: string;
    };
  }>({});

  useEffect(() => {
    chargerGIEsEnAttente();
  }, []);

  const chargerGIEsEnAttente = async () => {
    try {
      setLoading(true);
      const response = await gieService.getGIEsEnAttentePaiement();
      setGiesEnAttente(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des GIEs en attente');
    } finally {
      setLoading(false);
    }
  };

  const handlePaiementDataChange = (gieId: string, field: string, value: string | number) => {
    setPaiementData(prev => ({
      ...prev,
      [gieId]: {
        ...prev[gieId],
        [field]: value
      }
    }));
  };

  const validerPaiement = async (gieId: string) => {
    try {
      setValidationLoading(gieId);
      
      const data = paiementData[gieId] || {
        montantPaye: 50000,
        referenceTransaction: '',
        methodePaiement: 'virement'
      };

      await gieService.validerPaiementGIE(gieId, data);
      
      // Recharger la liste
      await chargerGIEsEnAttente();
      
      // Nettoyer les données de paiement
      setPaiementData(prev => {
        const newData = { ...prev };
        delete newData[gieId];
        return newData;
      });

    } catch (err: any) {
      setError(err.message || 'Erreur lors de la validation du paiement');
    } finally {
      setValidationLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2">Chargement des GIEs en attente...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <button
              onClick={chargerGIEsEnAttente}
              className="mt-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          GIEs en attente de paiement ({giesEnAttente.length})
        </h2>
        <button
          onClick={chargerGIEsEnAttente}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Actualiser
        </button>
      </div>

      {giesEnAttente.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun GIE en attente de paiement</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {giesEnAttente.map((gie) => {
            const currentPaiementData = paiementData[gie._id] || {
              montantPaye: 50000,
              referenceTransaction: '',
              methodePaiement: 'virement'
            };

            return (
              <div key={gie._id} className="bg-white border rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informations du GIE */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {gie.nomGIE}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Présidente:</span> {gie.presidenteNom}
                      </div>
                      <div>
                        <span className="font-medium">Téléphone:</span> {gie.presidenteTelephone || gie.contact?.telephone || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Adresse:</span> {
                          typeof gie.adresse === 'string' 
                            ? gie.adresse 
                            : `${gie.adresse?.commune || ''}, ${gie.adresse?.departement || ''}, ${gie.adresse?.region || ''}`
                        }
                      </div>
                      <div>
                        <span className="font-medium">Membres:</span> {gie.nombreMembres || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Secteur:</span> {gie.secteurActivite || gie.activites?.join(', ') || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Objectifs:</span> {gie.objectifs?.join(', ') || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Besoins financement:</span> {gie.besoinsFinancement ? formatMontant(gie.besoinsFinancement) : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Date d'enregistrement:</span> {formatDate(gie.dateCreation)}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        En attente de paiement
                      </span>
                    </div>

                    {gie.description && (
                      <div className="mt-3">
                        <span className="font-medium text-sm">Description:</span>
                        <p className="text-sm text-gray-600 mt-1">{gie.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Validation du paiement */}
                  <div className="border-l pl-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      Validation du paiement
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Montant payé (FCFA)
                        </label>
                        <input
                          type="number"
                          value={currentPaiementData.montantPaye}
                          onChange={(e) => handlePaiementDataChange(gie._id, 'montantPaye', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Référence transaction
                        </label>
                        <input
                          type="text"
                          value={currentPaiementData.referenceTransaction}
                          onChange={(e) => handlePaiementDataChange(gie._id, 'referenceTransaction', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Ex: TXN123456"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Méthode de paiement
                        </label>
                        <select
                          value={currentPaiementData.methodePaiement}
                          onChange={(e) => handlePaiementDataChange(gie._id, 'methodePaiement', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="virement">Virement bancaire</option>
                          <option value="mobile_money">Mobile Money</option>
                          <option value="especes">Espèces</option>
                          <option value="cheque">Chèque</option>
                        </select>
                      </div>

                      <button
                        onClick={() => validerPaiement(gie._id)}
                        disabled={validationLoading === gie._id}
                        className={`w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                          validationLoading === gie._id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {validationLoading === gie._id ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Validation...
                          </span>
                        ) : (
                          'Valider le paiement'
                        )}
                      </button>
                    </div>

                    {gie.adhesion && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Informations adhésion</h5>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Montant adhésion: {formatMontant(gie.adhesion.montantAdhesion)}</div>
                          <div>Statut validation: {gie.adhesion.validation.statut}</div>
                          <div>Statut paiement: {gie.adhesion.paiement.statut}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GestionGIEsEnAttente;
