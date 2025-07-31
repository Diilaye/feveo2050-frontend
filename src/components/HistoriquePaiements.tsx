import React, { useState } from 'react';
import PaiementList from '../components/PaiementList';
import { CreditCard, Filter, Calendar, DollarSign } from 'lucide-react';

const HistoriquePaiements: React.FC = () => {
  const [filtres, setFiltres] = useState({
    statut: '',
    typePaiement: '',
    dateDebut: '',
    dateFin: ''
  });
  const [afficherFiltres, setAfficherFiltres] = useState(false);

  const handleFiltreChange = (champ: string, valeur: string) => {
    setFiltres(prev => ({
      ...prev,
      [champ]: valeur
    }));
  };

  const resetFiltres = () => {
    setFiltres({
      statut: '',
      typePaiement: '',
      dateDebut: '',
      dateFin: ''
    });
  };

  const statutOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'reussi', label: 'Réussi' },
    { value: 'echoue', label: 'Échoué' },
    { value: 'annule', label: 'Annulé' },
    { value: 'rembourse', label: 'Remboursé' }
  ];

  const typePaiementOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'adhesion_gie', label: 'Adhésion GIE' },
    { value: 'investissement', label: 'Investissement' },
    { value: 'cotisation', label: 'Cotisation' },
    { value: 'service', label: 'Service' },
    { value: 'autre', label: 'Autre' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <CreditCard className="h-8 w-8 mr-3 text-blue-600" />
                Historique des paiements
              </h1>
              <p className="mt-2 text-gray-600">
                Consultez et gérez tous vos paiements effectués sur la plateforme FEVEO
              </p>
            </div>
            
            <button
              onClick={() => setAfficherFiltres(!afficherFiltres)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </button>
          </div>
        </div>

        {/* Filtres */}
        {afficherFiltres && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtrer les paiements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtre statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={filtres.statut}
                  onChange={(e) => handleFiltreChange('statut', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statutOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre type de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de paiement
                </label>
                <select
                  value={filtres.typePaiement}
                  onChange={(e) => handleFiltreChange('typePaiement', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {typePaiementOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date de début */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={filtres.dateDebut}
                  onChange={(e) => handleFiltreChange('dateDebut', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date de fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={filtres.dateFin}
                  onChange={(e) => handleFiltreChange('dateFin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={resetFiltres}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setAfficherFiltres(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Paiements réussis</p>
                <p className="text-2xl font-semibold text-gray-900">0 XOF</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ce mois</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En attente</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des paiements */}
        <div className="bg-white rounded-lg shadow">
          <PaiementList filtres={filtres} />
        </div>
      </div>
    </div>
  );
};

export default HistoriquePaiements;
