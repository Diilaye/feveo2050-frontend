import React, { useState, useEffect } from 'react';
import { 
  User, 
  Wallet, 
  Package, 
  Users, 
  Activity, 
  LogOut,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { useGIE } from '../hooks/useGIE';

const GIEDashboard = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const { gies, currentGIE, refreshGIEs, isLoading, error } = useGIE();
  const [activeTab, setActiveTab] = useState('wallet');

  // États pour les données du dashboard
  const [walletData, setWalletData] = useState({
    solde: 0,
    partsInvesties: 0,
    rendement: 0,
    derniereTransaction: new Date().toISOString().split('T')[0],
    transactions: []
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshGIEs();
    }
  }, [isAuthenticated, user]);

  // Rediriger si pas authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4">Accès restreint</h2>
          <p className="text-gray-600 text-center mb-6">
            Vous devez être connecté pour accéder au tableau de bord GIE.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center text-neutral-600 hover:text-emerald-600 mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
              <h1 className="text-xl font-bold text-neutral-900">
                Tableau de bord GIE
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">
                Bonjour, {user?.prenom} {user?.nom}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-neutral-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Navigation des onglets */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
          <div className="flex border-b border-neutral-200">
            {[
              { id: 'wallet', name: 'Wallet', icon: Wallet },
              { id: 'products', name: 'Produits', icon: Package },
              { id: 'activities', name: 'Activités', icon: Activity },
              { id: 'members', name: 'Membres', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-600 hover:text-emerald-600'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          {/* Onglet Wallet */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">Wallet GIE</h2>
                <div className="text-sm text-neutral-500">
                  Dernière mise à jour: {walletData.derniereTransaction}
                </div>
              </div>

              {/* Aperçu du Wallet */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-500 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Solde Total</p>
                      <p className="text-2xl font-bold">{walletData.solde.toLocaleString()} FCFA</p>
                    </div>
                    <Wallet className="w-8 h-8 opacity-80" />
                  </div>
                </div>

                <div className="bg-blue-500 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Parts Investies</p>
                      <p className="text-2xl font-bold">{walletData.partsInvesties}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 opacity-80" />
                  </div>
                </div>

                <div className="bg-purple-500 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Rendement</p>
                      <p className="text-2xl font-bold">{walletData.rendement}%</p>
                    </div>
                    <Activity className="w-8 h-8 opacity-80" />
                  </div>
                </div>
              </div>

              {/* Transactions récentes */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Transactions récentes</h3>
                {walletData.transactions.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune transaction pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {walletData.transactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div>
                          <p className="font-medium text-neutral-900">{transaction.description}</p>
                          <p className="text-sm text-neutral-500">{transaction.date}</p>
                        </div>
                        <div className={`font-bold ${
                          transaction.type === 'Crédit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'Crédit' ? '+' : '-'}{transaction.montant.toLocaleString()} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Autres onglets */}
          {activeTab === 'products' && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">Gestion des produits</h3>
              <p className="text-neutral-500">Cette section sera disponible prochainement</p>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">Activités du GIE</h3>
              <p className="text-neutral-500">Cette section sera disponible prochainement</p>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">Gestion des membres</h3>
              <p className="text-neutral-500">Cette section sera disponible prochainement</p>
            </div>
          )}
        </div>

        {/* Informations du GIE */}
        {gies.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Vos GIE</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gies.map((gie) => (
                <div key={gie._id} className="border border-neutral-200 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-900">{gie.nomGIE}</h4>
                  <p className="text-sm text-neutral-600">Présidente: {gie.presidenteNom} {gie.presidentePrenom}</p>
                  <p className="text-sm text-neutral-600">Région: {gie.adresse.region}</p>
                  <p className="text-sm text-neutral-600">Statut: <span className="capitalize">{gie.statut}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GIEDashboard;
