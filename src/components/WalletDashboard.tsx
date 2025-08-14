import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  LogOut, 
  Eye, 
  EyeOff, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  BarChart3,
  ExternalLink,
  Settings,
  Activity,
  Users,
  Package,
  Shield,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  UserPlus
} from 'lucide-react';

const WalletDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const [walletData, setWalletData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wallet');
  
  // États pour la gestion des membres
  const [membres, setMembres] = useState<any[]>([]);
  const [membresLoading, setMembresLoading] = useState(false);
  const [membresStats, setMembresStats] = useState<any>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberForm, setMemberForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    fonction: 'Membre',
    genre: '',
    cin: '',
    dateNaissance: '',
    profession: '',
    adresse: ''
  });

  // Charger les données du wallet au montage du composant
  useEffect(() => {
    const loadWalletData = () => {
      try {
        const storedData = localStorage.getItem('walletData');
        if (storedData) {
          const data = JSON.parse(storedData);
          setWalletData(data);
        } else {
          // Données par défaut si pas de données stockées
          setWalletData({
            gieInfo: {
              code: 'FEVEO-01-01-01-01-001',
              nom: 'GIE Agriculture Bio Dakar',
              presidente: 'Aïssatou Diallo'
            },
            balance: {
              current: 156000,
              invested: 60000,
              returns: 8400
            },
            cycleInfo: {
              currentDay: 12,
              totalDays: 60,
              dailyInvestment: 6000,
              nextInvestmentDate: '2025-07-28'
            },
            transactions: []
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWalletData();
  }, []);

  // Fonction pour charger les données des membres
  const loadMembres = async () => {
    if (!walletData?.gieInfo?.code) return;
    
    setMembresLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/wallet/members/${walletData.gieInfo.code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        setMembres(data.membres || []);
      } else {
        console.error('Erreur lors de la récupération des membres');
        setMembres([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error);
      setMembres([]);
    } finally {
      setMembresLoading(false);
    }
  };

  // Fonction pour charger les statistiques des membres
  const loadMembresStats = async () => {
    if (!walletData?.gieInfo?.code) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/wallet/members/${walletData.gieInfo.code}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        setMembresStats(data);
      } else {
        console.error('Erreur lors de la récupération des statistiques');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  // Fonction pour ajouter un membre
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletData?.gieInfo?.code) return;

    try {
      const response = await fetch(`http://localhost:5000/api/wallet/members/${walletData.gieInfo.code}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberForm),
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Membre ajouté avec succès !');
        setShowAddMemberModal(false);
        resetMemberForm();
        await loadMembres();
        await loadMembresStats();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      alert('Erreur lors de l\'ajout du membre');
    }
  };

  // Fonction pour modifier un membre
  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletData?.gieInfo?.code || !selectedMember) return;

    try {
      const response = await fetch(`http://localhost:5000/api/wallet/members/${walletData.gieInfo.code}/${selectedMember._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberForm),
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Membre modifié avec succès !');
        setShowEditMemberModal(false);
        resetMemberForm();
        setSelectedMember(null);
        await loadMembres();
        await loadMembresStats();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du membre:', error);
      alert('Erreur lors de la modification du membre');
    }
  };

  // Fonction pour supprimer un membre
  const handleDeleteMember = async (membre: any) => {
    if (!walletData?.gieInfo?.code) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${membre.prenom} ${membre.nom} ?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/wallet/members/${walletData.gieInfo.code}/${membre._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Membre supprimé avec succès !');
        await loadMembres();
        await loadMembresStats();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
      alert('Erreur lors de la suppression du membre');
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetMemberForm = () => {
    setMemberForm({
      nom: '',
      prenom: '',
      telephone: '',
      fonction: 'Membre',
      genre: '',
      cin: '',
      dateNaissance: '',
      profession: '',
      adresse: ''
    });
  };

  // Fonction pour ouvrir le modal d'édition
  const openEditModal = (membre: any) => {
    setSelectedMember(membre);
    setMemberForm({
      nom: membre.nom || '',
      prenom: membre.prenom || '',
      telephone: membre.telephone || '',
      fonction: membre.fonction || membre.role || 'Membre',
      genre: membre.genre || '',
      cin: membre.cin || '',
      dateNaissance: membre.dateNaissance ? membre.dateNaissance.split('T')[0] : '',
      profession: membre.profession || '',
      adresse: membre.adresse || ''
    });
    setShowEditMemberModal(true);
  };

  // Charger les membres quand on change d'onglet vers membres
  useEffect(() => {
    if (activeTab === 'membres' && walletData?.gieInfo?.code) {
      loadMembres();
      loadMembresStats();
    }
  }, [activeTab, walletData?.gieInfo?.code]);

  // ========== TOUS LES HOOKS DOIVENT ÊTRE AU-DESSUS DE CETTE LIGNE ==========
  
  // Vérifications conditionnelles après tous les hooks
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Erreur lors du chargement des données du wallet</p>
          <button
            onClick={() => navigate('/wallet/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    // Nettoyer les données du wallet lors de la déconnexion
    localStorage.removeItem('walletData');
    localStorage.removeItem('walletSession');
    navigate('/');
  };

  // Données simulées pour les transactions
  const transactions = [
    { type: 'investment', amount: 6000, date: '2025-07-26', description: 'Investissement jour 12' },
    { type: 'return', amount: 420, date: '2025-07-25', description: 'Retour investissement jour 11' },
    { type: 'investment', amount: 6000, date: '2025-07-25', description: 'Investissement jour 11' },
    { type: 'return', amount: 420, date: '2025-07-24', description: 'Retour investissement jour 10' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const progressPercentage = (walletData.cycleInfo.currentDay / walletData.cycleInfo.totalDays) * 100;

  // Calculer les dates du cycle d'investissement
  const getInvestmentDates = () => {
    const startDate = new Date('2025-07-01'); // Date de début du cycle
    const dates = [];
    
    for (let i = 0; i < walletData.cycleInfo.totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        date: date,
        dayNumber: i + 1,
        isInvested: i + 1 <= walletData.cycleInfo.currentDay,
        isToday: i + 1 === walletData.cycleInfo.currentDay
      });
    }
    return dates;
  };

  const investmentDates = getInvestmentDates();
  
  // Fonction pour regrouper les dates par mois avec structure cohérente
  const groupByMonth = (dates) => {
    const grouped = {};
    
    dates.forEach(dateObj => {
      const date = dateObj.date;
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const startDay = (firstDay.getDay() + 6) % 7; // Lundi = 0
        
        grouped[monthKey] = {
          startDay: startDay,
          daysInMonth: lastDay.getDate(),
          investmentDays: []
        };
      }
      
      grouped[monthKey].investmentDays.push(date.getDate());
    });
    
    return grouped;
  };  const monthlyData = groupByMonth(investmentDates);

  // Données pour la page investissements
  const investmentPlans = [
    {
      id: 1,
      name: 'Plan Quotidien',
      description: 'Investissement quotidien de 6 000 FCFA',
      amount: 6000,
      frequency: 'Quotidien',
      duration: '60 jours',
      expectedReturn: '7%',
      isActive: true,
      totalInvested: walletData.cycleInfo.currentDay * 6000,
      remainingDays: walletData.cycleInfo.totalDays - walletData.cycleInfo.currentDay
    },
    {
      id: 2,
      name: 'Plan Hebdomadaire',
      description: 'Investissement hebdomadaire de 42 000 FCFA',
      amount: 42000,
      frequency: 'Hebdomadaire',
      duration: '8 semaines',
      expectedReturn: '8%',
      isActive: false,
      totalInvested: 0,
      remainingDays: 0
    },
    {
      id: 3,
      name: 'Plan Mensuel',
      description: 'Investissement mensuel de 180 000 FCFA',
      amount: 180000,
      frequency: 'Mensuel',
      duration: '2 mois',
      expectedReturn: '10%',
      isActive: false,
      totalInvested: 0,
      remainingDays: 0
    }
  ];

  const upcomingInvestments = [
    {
      date: '2025-07-29',
      amount: 6000,
      type: 'Plan Quotidien',
      status: 'Programmé'
    },
    {
      date: '2025-07-30',
      amount: 6000,
      type: 'Plan Quotidien',
      status: 'Programmé'
    },
    {
      date: '2025-07-31',
      amount: 6000,
      type: 'Plan Quotidien',
      status: 'Programmé'
    },
    {
      date: '2025-08-01',
      amount: 6000,
      type: 'Plan Quotidien',
      status: 'Programmé'
    }
  ];

  // Fonction pour rendre le contenu selon l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'investments':
        return (
          <>
            {/* En-tête de la page investissements */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Mes Investissements GIE</h3>
                <p className="text-blue-100">Gérez votre portefeuille d'investissements et maximisez vos rendements</p>
              </div>
            </div>

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Portfolio Total</h4>
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.balance.current + walletData.balance.invested)}</p>
                <p className="text-xs text-green-600 mt-1">+5.2% ce mois</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Investi Actuellement</h4>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.balance.invested)}</p>
                <p className="text-xs text-blue-600 mt-1">Jour {walletData.cycleInfo.currentDay}/{walletData.cycleInfo.totalDays}</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Retours Générés</h4>
                  <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.balance.returns)}</p>
                <p className="text-xs text-green-600 mt-1">+14% ROI</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Prochaine Échéance</h4>
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(walletData.cycleInfo.nextInvestmentDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </p>
                <p className="text-xs text-gray-600 mt-1">{formatCurrency(walletData.cycleInfo.dailyInvestment)}</p>
              </div>
            </div>

            {/* Plans d'investissement améliorés */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Plans d'Investissement Disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {investmentPlans.map((plan) => (
                  <div key={plan.id} className={`rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl ${
                    plan.isActive 
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' 
                      : 'bg-white border-2 border-gray-200 hover:border-blue-400'
                  }`}>
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        plan.isActive 
                          ? 'bg-white bg-opacity-20' 
                          : 'bg-blue-100'
                      }`}>
                        <TrendingUp className={`w-8 h-8 ${
                          plan.isActive ? 'text-white' : 'text-blue-600'
                        }`} />
                      </div>
                      <h4 className={`text-2xl font-bold mb-2 ${
                        plan.isActive ? 'text-white' : 'text-gray-900'
                      }`}>
                        {plan.name}
                      </h4>
                      <p className={`text-sm ${
                        plan.isActive ? 'text-green-100' : 'text-gray-600'
                      }`}>
                        {plan.description}
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className={`text-center py-4 rounded-xl ${
                        plan.isActive 
                          ? 'bg-white bg-opacity-20' 
                          : 'bg-gray-50'
                      }`}>
                        <p className={`text-3xl font-bold ${
                          plan.isActive ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formatCurrency(plan.amount)}
                        </p>
                        <p className={`text-sm ${
                          plan.isActive ? 'text-green-100' : 'text-gray-600'
                        }`}>
                          par {plan.frequency.toLowerCase()}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className={`text-center p-3 rounded-lg ${
                          plan.isActive 
                            ? 'bg-white bg-opacity-20' 
                            : 'bg-blue-50'
                        }`}>
                          <p className={`text-lg font-bold ${
                            plan.isActive ? 'text-white' : 'text-blue-600'
                          }`}>
                            {plan.duration}
                          </p>
                          <p className={`text-xs ${
                            plan.isActive ? 'text-green-100' : 'text-gray-600'
                          }`}>
                            Durée
                          </p>
                        </div>
                        <div className={`text-center p-3 rounded-lg ${
                          plan.isActive 
                            ? 'bg-white bg-opacity-20' 
                            : 'bg-green-50'
                        }`}>
                          <p className={`text-lg font-bold ${
                            plan.isActive ? 'text-white' : 'text-green-600'
                          }`}>
                            {plan.expectedReturn}
                          </p>
                          <p className={`text-xs ${
                            plan.isActive ? 'text-green-100' : 'text-gray-600'
                          }`}>
                            Rendement
                          </p>
                        </div>
                      </div>
                    </div>

                    {plan.isActive ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center text-white">
                          <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                          <span className="font-medium">Plan Actif</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <p className="text-sm text-green-100">Total Investi</p>
                            <p className="font-bold text-white">{formatCurrency(plan.totalInvested)}</p>
                          </div>
                          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <p className="text-sm text-green-100">Jours Restants</p>
                            <p className="font-bold text-white">{plan.remainingDays}</p>
                          </div>
                        </div>
                        <button className="w-full bg-white text-green-600 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all font-medium shadow-md">
                          Gérer ce Plan
                        </button>
                      </div>
                    ) : (
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md flex items-center justify-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Démarrer ce Plan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Performances et Projections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Historique des performances */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Performances Mensuelles
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { month: 'Juillet 2025', invested: 72000, returned: 5040, percentage: 7.0 },
                      { month: 'Juin 2025', invested: 180000, returned: 14400, percentage: 8.0 },
                      { month: 'Mai 2025', invested: 180000, returned: 12600, percentage: 7.0 },
                    ].map((perf, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">{perf.month}</p>
                          <p className="text-sm text-gray-600">Investi: {formatCurrency(perf.invested)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+{formatCurrency(perf.returned)}</p>
                          <p className="text-sm text-green-500">+{perf.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projections futures */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Projections Futures
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-2">Fin du cycle actuel</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Investissement total</p>
                          <p className="text-xl font-bold text-blue-600">
                            {formatCurrency(walletData.cycleInfo.totalDays * walletData.cycleInfo.dailyInvestment)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Retour estimé</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(walletData.cycleInfo.totalDays * walletData.cycleInfo.dailyInvestment * 0.07)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { period: '3 mois', investment: 540000, returns: 37800 },
                        { period: '6 mois', investment: 1080000, returns: 86400 },
                        { period: '1 an', investment: 2160000, returns: 194400 }
                      ].map((proj, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">{proj.period}</span>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{formatCurrency(proj.investment)}</p>
                            <p className="font-medium text-green-600">+{formatCurrency(proj.returns)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'membres':
        return (
          <>
            {/* En-tête de la page membres */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Gestion des Membres</h3>
                <p className="text-purple-100">Gérez les membres de votre GIE (max 40 membres)</p>
              </div>
            </div>

            {/* Statistiques des membres */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Total Membres</h4>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{membres.length}</p>
                <p className="text-xs text-gray-600 mt-1">sur 40 max</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Membres Actifs</h4>
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{membres.length}</p>
                <p className="text-xs text-blue-600 mt-1">100% du total</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Places Disponibles</h4>
                  <UserPlus className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{40 - membres.length}</p>
                <p className="text-xs text-green-600 mt-1">
                  {membres.length >= 40 ? 'Limite atteinte' : 'Places libres'}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Nouveaux Membres</h4>
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {membresStats?.dernierAjout ? '1' : '0'}
                </p>
                <p className="text-xs text-gray-600 mt-1">Ce mois-ci</p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="mb-6 flex flex-wrap gap-4">
              <button 
                onClick={() => setShowAddMemberModal(true)}
                disabled={membres.length >= 40}
                className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
                  membres.length >= 40 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un Membre {membres.length >= 40 && '(Limite atteinte)'}
              </button>
              
              <button 
                onClick={() => loadMembres()}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Activity className="w-5 h-5 mr-2" />
                Actualiser
              </button>
            </div>

            {/* Liste des membres */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Liste des Membres</h3>
                  <div className="flex items-center space-x-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Tous les statuts</option>
                      <option>Actif</option>
                      <option>Inactif</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Tous les rôles</option>
                      <option>Présidente</option>
                      <option>Vice-Président</option>
                      <option>Trésorière</option>
                      <option>Secrétaire</option>
                      <option>Membre</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cotisation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {membres.map((membre) => (
                      <tr key={membre.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {membre.prenom.charAt(0)}{membre.nom.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {membre.prenom} {membre.nom}
                              </div>
                              <div className="text-sm text-gray-500">
                                Adhésion: {new Date(membre.dateAdhesion).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            membre.role === 'Présidente' 
                              ? 'bg-purple-100 text-purple-800'
                              : membre.role === 'Vice-Président'
                              ? 'bg-blue-100 text-blue-800'
                              : membre.role === 'Trésorière'
                              ? 'bg-green-100 text-green-800'
                              : membre.role === 'Secrétaire'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {membre.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-gray-600">{membre.telephone}</span>
                            </div>
                            <div className="text-gray-500">{membre.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(membre.cotisation)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Par mois
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            membre.statut === 'Actif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {membre.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 transition-colors">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="text-orange-600 hover:text-orange-900 transition-colors">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Carte de détails rapide */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Répartition par Rôle
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {['Présidente', 'Vice-Président', 'Trésorière', 'Secrétaire', 'Membre'].map((role) => {
                      const count = membres.filter(m => m.role === role).length;
                      const percentage = Math.round((count / membres.length) * 100);
                      return (
                        <div key={role} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{role}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Adhésions Récentes
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {membres
                      .sort((a, b) => new Date(b.dateAdhesion).getTime() - new Date(a.dateAdhesion).getTime())
                      .slice(0, 4)
                      .map((membre) => (
                        <div key={membre.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {membre.prenom.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{membre.prenom} {membre.nom}</p>
                              <p className="text-sm text-gray-600">{membre.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(membre.dateAdhesion).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.floor((new Date().getTime() - new Date(membre.dateAdhesion).getTime()) / (1000 * 60 * 60 * 24))} jours
                            </p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'settings':
        return (
          <>
            {/* En-tête de la page paramètres */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Paramètres</h3>
                <p className="text-gray-100">Gérez les paramètres de votre GIE, wallet et profil utilisateur</p>
              </div>
            </div>

            {/* Navigation des paramètres */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Menu latéral des paramètres */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Catégories</h3>
                  <nav className="space-y-2">
                    {[
                      { id: 'profile', name: 'Profil', icon: Users },
                      { id: 'gie', name: 'GIE', icon: Package },
                      { id: 'wallet', name: 'Wallet', icon: CreditCard },
                      { id: 'notifications', name: 'Notifications', icon: Send },
                      { id: 'security', name: 'Sécurité', icon: Shield },
                      { id: 'system', name: 'Système', icon: Settings }
                    ].map((item) => (
                      <button
                        key={item.id}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Contenu principal des paramètres */}
              <div className="lg:col-span-3 space-y-6">
                {/* Paramètres du profil */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Paramètres du Profil
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                        <input 
                          type="text" 
                          defaultValue="Diallo"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                        <input 
                          type="text" 
                          defaultValue="Aïssatou"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          type="email" 
                          defaultValue="aissatou.diallo@gmail.com"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        <input 
                          type="tel" 
                          defaultValue="+221 77 123 45 67"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Sauvegarder le Profil
                      </button>
                    </div>
                  </div>
                </div>

                {/* Paramètres du GIE */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-green-600" />
                      Paramètres du GIE
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du GIE</label>
                          <input 
                            type="text" 
                            defaultValue="GIE Agriculture Bio Dakar"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Code GIE</label>
                          <input 
                            type="text" 
                            defaultValue="FEVEO-01-01-01-01-001"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea 
                          rows={3}
                          defaultValue="Groupement d'Intérêt Économique spécialisé dans l'agriculture biologique et durable à Dakar"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                          <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                            <option value="agriculture">Agriculture</option>
                            <option value="commerce">Commerce</option>
                            <option value="artisanat">Artisanat</option>
                            <option value="services">Services</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Région</label>
                          <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                            <option value="dakar">Dakar</option>
                            <option value="thies">Thiès</option>
                            <option value="saint-louis">Saint-Louis</option>
                            <option value="kaolack">Kaolack</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de membres max</label>
                          <input 
                            type="number" 
                            defaultValue="50"
                            min="1"
                            max="100"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Sauvegarder le GIE
                      </button>
                    </div>
                  </div>
                </div>

                {/* Paramètres du Wallet */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                      Paramètres du Wallet
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Investissement quotidien</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              defaultValue="6000"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <span className="absolute right-3 top-2 text-gray-500 text-sm">FCFA</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Durée du cycle</label>
                          <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="30">30 jours</option>
                            <option value="60" selected>60 jours</option>
                            <option value="90">90 jours</option>
                            <option value="120">120 jours</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Seuil d'alerte</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              defaultValue="10000"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <span className="absolute right-3 top-2 text-gray-500 text-sm">FCFA</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Auto-investissement</label>
                          <div className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              defaultChecked
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-gray-700">Activer l'investissement automatique</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-900 mb-2">Statistiques du Wallet</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-purple-600">{formatCurrency(walletData.balance.current)}</p>
                            <p className="text-sm text-purple-700">Solde actuel</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600">{walletData.cycleInfo.currentDay}</p>
                            <p className="text-sm text-purple-700">Jours investis</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600">7.2%</p>
                            <p className="text-sm text-purple-700">Rendement moyen</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Sauvegarder le Wallet
                      </button>
                    </div>
                  </div>
                </div>

                {/* Paramètres de notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <Send className="w-5 h-5 mr-2 text-orange-600" />
                      Notifications
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        { id: 'investment', label: 'Rappels d\'investissement', desc: 'Recevoir des notifications pour les investissements quotidiens', checked: true },
                        { id: 'returns', label: 'Retours d\'investissement', desc: 'Notifications lors des retours sur investissements', checked: true },
                        { id: 'members', label: 'Activités des membres', desc: 'Notifications sur les nouvelles adhésions et modifications', checked: false },
                        { id: 'system', label: 'Mises à jour système', desc: 'Notifications importantes du système FEVEO', checked: true },
                        { id: 'monthly', label: 'Rapport mensuel', desc: 'Recevoir un résumé mensuel de vos activités', checked: true }
                      ].map((notification) => (
                        <div key={notification.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <input 
                            type="checkbox" 
                            defaultChecked={notification.checked}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{notification.label}</p>
                            <p className="text-sm text-gray-600">{notification.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                        Sauvegarder les Notifications
                      </button>
                    </div>
                  </div>
                </div>

                {/* Paramètres de sécurité */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-red-600" />
                      Sécurité
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Changer le mot de passe</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                            <input 
                              type="password" 
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                              <input 
                                type="password" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                              <input 
                                type="password" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-medium text-gray-900 mb-4">Authentification à deux facteurs</h4>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <span className="text-gray-700">Activer l'authentification à deux facteurs (2FA)</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-medium text-gray-900 mb-4">Sessions actives</h4>
                        <div className="space-y-3">
                          {[
                            { device: 'MacBook Pro - Safari', location: 'Dakar, Sénégal', time: 'Maintenant', current: true },
                            { device: 'iPhone - Safari', location: 'Dakar, Sénégal', time: 'Il y a 2 heures', current: false },
                          ].map((session, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 flex items-center">
                                  {session.device}
                                  {session.current && (
                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                      Session actuelle
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-gray-600">{session.location} • {session.time}</p>
                              </div>
                              {!session.current && (
                                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                  Déconnecter
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                        Déconnecter toutes les sessions
                      </button>
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Changer le mot de passe
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions dangereuses */}
                <div className="bg-white rounded-xl shadow-sm border border-red-200">
                  <div className="p-6 border-b border-red-200">
                    <h3 className="text-lg font-bold text-red-700 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Zone dangereuse
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <h4 className="font-medium text-red-900">Supprimer le compte</h4>
                          <p className="text-sm text-red-700">Supprime définitivement votre compte et toutes vos données</p>
                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                          Supprimer
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div>
                          <h4 className="font-medium text-orange-900">Quitter le GIE</h4>
                          <p className="text-sm text-orange-700">Quitte le GIE actuel et perd l'accès aux données partagées</p>
                        </div>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                          Quitter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'wallet':
      default:
        return (
          <>
            {/* Cartes métriques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-600">Solde Total</h3>
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.balance)}</p>
                <p className="text-xs text-green-600 mt-1">+2.5% ce mois</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-green-600">Investissements</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(walletData.cycleInfo.currentDay * walletData.cycleInfo.dailyInvestment)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Jour {walletData.cycleInfo.currentDay}/{walletData.cycleInfo.totalDays}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-orange-600">Revenus</h3>
                  <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(123750)}</p>
                <p className="text-xs text-green-600 mt-1">+7.2% rendement</p>
              </div>
            </div>

            {/* Layout en deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendrier d'investissement - Mois actuel seulement */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Calendrier d'investissement</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Cycle actuel: Jour {walletData.cycleInfo.currentDay} sur {walletData.cycleInfo.totalDays}
                  </p>
                </div>
                <div className="p-6">
                  {(() => {
                    // Obtenir le mois actuel
                    const currentDate = new Date();
                    const currentMonthKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
                    const currentMonthData = monthlyData[currentMonthKey];
                    
                    if (!currentMonthData) return null;
                    
                    const [year, month] = currentMonthKey.split('-');
                    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('fr-FR', { 
                      month: 'long', 
                      year: 'numeric' 
                    });

                    return (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 capitalize text-center">{monthName}</h4>
                        
                        {/* En-têtes des jours */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Grille du calendrier */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                          {/* Cases vides pour les jours précédents */}
                          {Array.from({ length: currentMonthData.startDay }).map((_, index) => (
                            <div key={`empty-${index}`} className="h-10"></div>
                          ))}
                          
                          {/* Jours du mois */}
                          {Array.from({ length: currentMonthData.daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const dateStr = `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            const isInvestmentDay = currentMonthData.investmentDays.includes(day);
                            const isToday = dateStr === new Date().toISOString().split('T')[0];
                            
                            return (
                              <div
                                key={day}
                                className={`h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                                  isInvestmentDay
                                    ? isToday
                                      ? 'bg-orange-500 text-white ring-2 ring-orange-300 shadow-lg'
                                      : 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                                    : day <= new Date().getDate()
                                    ? 'bg-gray-200 text-gray-600'
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                } cursor-pointer`}
                                title={isInvestmentDay ? `Investissement: ${formatCurrency(6000)}` : `Jour ${day}`}
                              >
                                {day}
                              </div>
                            );
                          })}
                        </div>

                        {/* Statistiques du mois */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-green-600">{currentMonthData.investmentDays.length}</p>
                              <p className="text-xs text-gray-600">Jours investis</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-blue-600">{formatCurrency(currentMonthData.investmentDays.length * 6000)}</p>
                              <p className="text-xs text-gray-600">Total investi</p>
                            </div>
                          </div>
                        </div>

                        {/* Légende */}
                        <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded shadow-sm"></div>
                            <span className="text-gray-600">Investis</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded ring-1 ring-orange-300"></div>
                            <span className="text-gray-600">Aujourd'hui</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-100 rounded border border-blue-300"></div>
                            <span className="text-gray-600">Prévus</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Transactions récentes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Transactions récentes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {transactions.slice(0, 6).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === 'investment' 
                              ? 'bg-blue-100' 
                              : 'bg-green-100'
                          }`}>
                            {transaction.type === 'investment' ? (
                              <ArrowUpRight className="w-5 h-5 text-blue-600" />
                            ) : (
                              <ArrowDownLeft className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className={`font-bold text-lg ${
                          transaction.type === 'investment' 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {transaction.type === 'investment' ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    Voir toutes les transactions
                  </button>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Wallet GIE</h1>
              <p className="text-sm text-gray-600">{walletData.gieInfo.code}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{walletData.gieInfo.presidente}</p>
              <p className="text-xs text-gray-500">Présidente</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-sm">
          <nav className="p-4">
            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === 'wallet' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Mon Wallet</span>
            </button>

            {[
              { id: 'investments', name: 'Investissements', icon: TrendingUp },
              { id: 'cycle', name: 'Cycle Actuel', icon: BarChart3 },
              { id: 'membres', name: 'Membres', icon: Users },
              { id: 'settings', name: 'Paramètres', icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Title Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mon Wallet GIE</h2>
            <p className="text-sm text-gray-600">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          {/* Contenu dynamique selon l'onglet actif */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
