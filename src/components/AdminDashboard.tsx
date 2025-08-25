import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Shield, 
  Users, 
  Building, 
  DollarSign, 
  FileText, 
  Settings, 
  LogOut,
  BarChart3,
  CheckCircle,
  Clock,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Bell,
  ListFilter,
  UserCheck
} from 'lucide-react';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';

// Interface pour les données GIE
interface GIE {
  _id: string;
  identifiantGIE: string;
  nomGIE: string;
  region: string;
  departement: string;
  commune: string;
  statutAdhesion: string;
  statutEnregistrement: string;
  dateCreation: string;
  presidente?: {
    telephone?: string;
    nom?: string;
    prenom?: string;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuthContext();
  const [gieCount, setGieCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gies, setGies] = useState<GIE[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour la pagination et la recherche
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fonction pour récupérer le nombre de GIE depuis l'API
  const fetchGIECount = async () => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      console.log(token);

      const response = await axios.get<{ success: boolean, count: number }>('/admin/gies/count', {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success && response.data.count !== undefined) {
        setGieCount(response.data.count);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de GIE:', error);
    }
  };
  
  // Fonction pour récupérer la liste des GIEs avec pagination et recherche
  const fetchGIEs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminAuthToken');
      
      const response = await axios.get<{ success: boolean, data: GIE[], total: number }>('/admin/gies', {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm.trim() || undefined
        }
      });
      
      if (response.data && response.data.success) {
        setGies(response.data.data);
        setTotalItems(response.data.total);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des GIEs:', error);
      setError('Impossible de charger la liste des GIEs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour activer l'adhésion d'un GIE
  const activerAdhesion = async (gieId: string) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      
      const response = await axios.post<{ success: boolean, message: string }>(
        `/admin/gies/${gieId}/activer-adhesion`, 
        {},
        {
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Rafraîchir la liste des GIEs après l'activation
        fetchGIEs();
        alert('Adhésion activée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation de l\'adhésion:', error);
      alert('Erreur lors de l\'activation de l\'adhésion');
    }
  };

  // Gestion du changement de page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  // Gestion de la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    fetchGIEs();
  };

  // Effectuer la requête au chargement du composant et à chaque changement de pagination
  useEffect(() => {
    fetchGIECount();
    
    // Si l'onglet GIE est actif, charger la liste des GIEs
    if (activeTab === 'gie') {
      fetchGIEs();
    }
  }, [activeTab, currentPage]);

  const adminStats = [
    { label: 'GIE Actifs', value: gieCount.toString(), icon: Building, color: 'blue-900', trend: '+12%' },
    { label: 'Utilisateurs', value: '156', icon: Users, color: 'green-500', trend: '+8%' },
    { label: 'Adhésions en attente', value: '8', icon: FileText, color: 'orange-500', trend: '+3' },
    { label: 'Volume total', value: '2.4M FCFA', icon: DollarSign, color: 'purple-500', trend: '+24%' }
  ];

  const recentActivities = [
    {
      type: 'adhesion',
      title: 'Nouvelle demande d\'adhésion',
      subtitle: 'GIE FEVEO-02-01-01-01-003',
      time: 'Il y a 2h',
      icon: FileText,
      color: 'blue',
      status: 'pending'
    },
    {
      type: 'investment',
      title: 'Investissement validé',
      subtitle: '6,000 FCFA - GIE FEVEO-01-01-01-01-001',
      time: 'Il y a 4h',
      icon: DollarSign,
      color: 'green',
      status: 'approved'
    },
    {
      type: 'user',
      title: 'Nouvel utilisateur inscrit',
      subtitle: 'Aïssatou Diallo - Présidente GIE',
      time: 'Il y a 6h',
      icon: Users,
      color: 'orange',
      status: 'active'
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Validation GIE FEVEO-03-01-01-01-001',
      description: 'Dossier complet en attente de validation',
      priority: 'high',
      deadline: '2024-03-20'
    },
    {
      id: 2,
      title: 'Rapport mensuel financier',
      description: 'Générer le rapport de mars 2024',
      priority: 'medium',
      deadline: '2024-03-25'
    },
    {
      id: 3,
      title: 'Mise à jour base de données',
      description: 'Migration des anciennes données',
      priority: 'low',
      deadline: '2024-03-30'
    }
  ];

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'gie':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-1/3">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Rechercher par numéro de présidente..."
                          className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <button 
                          type="submit"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-primary-600"
                        >
                          Rechercher
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                        fetchGIEs();
                      }} 
                      className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all"
                    >
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span>Réinitialiser</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500">Chargement en cours...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={() => fetchGIEs()}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <>
                  {gies.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-gray-500">Aucun GIE trouvé</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-6 py-4 font-medium">ID GIE</th>
                            <th className="px-6 py-4 font-medium">Nom</th>
                            <th className="px-6 py-4 font-medium">Région</th>
                            <th className="px-6 py-4 font-medium">Présidente</th>
                            <th className="px-6 py-4 font-medium">Téléphone</th>
                            <th className="px-6 py-4 font-medium">Statut Adhésion</th>
                            <th className="px-6 py-4 font-medium">Statut Enregistrement</th>
                            <th className="px-6 py-4 font-medium">Date Création</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {gies.map((gie) => (
                            <tr key={gie._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-gray-800">{gie.identifiantGIE}</td>
                              <td className="px-6 py-4">{gie.nomGIE}</td>
                              <td className="px-6 py-4">{gie.region}</td>
                              <td className="px-6 py-4">{gie.presidente ? `${gie.presidente.prenom || ''} ${gie.presidente.nom || ''}` : '-'}</td>
                              <td className="px-6 py-4">{gie.presidente && gie.presidente.telephone ? gie.presidente.telephone : '-'}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex text-xs font-medium rounded-full px-3 py-1 ${
                                  gie.statutAdhesion === 'validee' 
                                    ? 'bg-green-100 text-green-700' 
                                    : gie.statutAdhesion === 'en_attente'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {gie.statutAdhesion === 'validee' 
                                    ? 'Validée' 
                                    : gie.statutAdhesion === 'en_attente'
                                    ? 'En attente'
                                    : 'Non validée'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex text-xs font-medium rounded-full px-3 py-1 ${
                                  gie.statutEnregistrement === 'valide' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {gie.statutEnregistrement === 'valide' ? 'Valide' : 'En attente'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {new Date(gie.dateCreation).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-3">
                                  <button 
                                    className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                                    onClick={() => navigate(`/admin/gies/${gie._id}`)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  
                                  {(gie.statutAdhesion !== 'validee' || gie.statutEnregistrement !== 'valide') && (
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                                      onClick={() => activerAdhesion(gie._id)}
                                      title="Activer l'adhésion"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
              
              <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {gies.length > 0 ? `Affichage de ${(currentPage - 1) * itemsPerPage + 1} à ${Math.min(currentPage * itemsPerPage, totalItems)} sur ${totalItems} GIEs` : 'Aucun GIE à afficher'}
                </div>
                {totalItems > itemsPerPage && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={`px-4 py-2 text-sm border border-gray-200 rounded-xl transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    
                    {/* Affichage des numéros de page */}
                    <div className="flex space-x-1">
                      {[...Array(Math.ceil(totalItems / itemsPerPage))].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          className={`w-8 h-8 flex items-center justify-center text-sm rounded-md ${
                            currentPage === index + 1 
                              ? 'bg-primary-600 text-white' 
                              : 'border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => currentPage < Math.ceil(totalItems / itemsPerPage) && handlePageChange(currentPage + 1)}
                      className={`px-4 py-2 text-sm border border-gray-200 rounded-xl transition-colors ${currentPage >= Math.ceil(totalItems / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {adminStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 rounded-xl p-3 ${
                        stat.color.includes('blue') ? 'bg-primary-50' : 
                        stat.color.includes('green') ? 'bg-green-50' :
                        stat.color.includes('amber') ? 'bg-amber-50' :
                        'bg-orange-50'
                      }`}>
                        <stat.icon className={`w-6 h-6 ${
                          stat.color.includes('blue') ? 'text-primary-600' : 
                          stat.color.includes('green') ? 'text-green-600' :
                          stat.color.includes('amber') ? 'text-amber-600' :
                          'text-orange-500'
                        }`} />
                      </div>
                      <div className="ml-4 truncate">
                        <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                        <div className="mt-2.5 flex items-baseline">
                          <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                          <span className="ml-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                      Voir détails
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Évolution des adhésions</h3>
                  <div className="flex gap-2">
                    <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600">Mois</button>
                    <button className="text-xs font-medium px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">Année</button>
                  </div>
                </div>
                <div className="p-5 h-72 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Graphique d'évolution des adhésions</p>
                  {/* Emplacement pour un graphique */}
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Volume d'investissement</h3>
                  <div className="flex gap-2">
                    <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600">Trimestre</button>
                    <button className="text-xs font-medium px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">Année</button>
                  </div>
                </div>
                <div className="p-5 h-72 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Graphique du volume d'investissement</p>
                  {/* Emplacement pour un graphique */}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Activités récentes</h3>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">Voir tout</a>
                </div>
                <div className="p-5">
                  <div className="space-y-6">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 mr-4">
                          <div className={`w-11 h-11 rounded-xl ${
                            activity.color === 'blue' ? 'bg-primary-50' :
                            activity.color === 'green' ? 'bg-green-50' :
                            activity.color === 'amber' ? 'bg-amber-50' :
                            'bg-orange-50'
                          } flex items-center justify-center`}>
                            <activity.icon className={`w-5 h-5 ${
                              activity.color === 'blue' ? 'text-primary-600' :
                              activity.color === 'green' ? 'text-green-600' :
                              activity.color === 'amber' ? 'text-amber-600' :
                              'text-orange-500'
                            }`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{activity.subtitle}</p>
                            </div>
                            <span className={`inline-flex text-xs font-medium rounded-full px-3 py-1 ${
                              activity.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                              'bg-primary-100 text-primary-700'
                            }`}>
                              {activity.status === 'pending' ? 'En attente' :
                               activity.status === 'approved' ? 'Validé' : 'Actif'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1.5">{activity.time}</p>
                          {index < recentActivities.length - 1 && (
                            <div className="absolute ml-5.5 mt-4 w-0.5 h-6 bg-gray-200"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Tâches en attente</h3>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">Voir tout</a>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-start">
                          <div className={`w-3 h-3 rounded-full mt-1.5 mr-3 ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                              <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
                              <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${
                                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {task.priority === 'high' ? 'Urgent' :
                                 task.priority === 'medium' ? 'Moyen' : 'Faible'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{task.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs text-gray-500">Échéance: <span className="font-medium">{task.deadline}</span></p>
                              <div className="flex space-x-2">
                                <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-orange-500 transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

     

      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-1/3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span>Filtrer</span>
                    </button>
                    <button className="px-4 py-2.5 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-2 transition-all">
                      <Plus className="w-4 h-4" />
                      <span>Ajouter utilisateur</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg shadow-md transition-all">
                    <div className="p-5">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center text-white font-medium">
                          {item % 2 === 0 ? 'MD' : 'AS'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-800 truncate">
                            {item % 2 === 0 ? 'Marie Diop' : 'Amadou Sow'}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {item % 2 === 0 ? 'Présidente de GIE' : 'Membre de GIE'}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex text-xs font-medium rounded-full px-3 py-1 ${
                            item % 3 === 0 ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
                          }`}>
                            {item % 3 === 0 ? 'Actif' : 'Vérifié'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-5 text-sm text-gray-600">
                        <div className="flex items-center mb-2">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          <span>GIE FEVEO-0{item}-01-01-001</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Inscrit le 01/0{item}/2024</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end space-x-3">
                      <button className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Affichage de 1 à 6 sur 156 utilisateurs
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Précédent
                  </button>
                  <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'adhesions':
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="font-medium text-gray-800">Demandes d'adhésion</h3>
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  8 en attente
                </span>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span>Filtrer</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-medium">Code GIE</th>
                    <th className="px-6 py-4 font-medium">Demandeur</th>
                    <th className="px-6 py-4 font-medium">Date soumission</th>
                    <th className="px-6 py-4 font-medium">Documents</th>
                    <th className="px-6 py-4 font-medium">Statut</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">FEVEO-0{item}-01-01-{item}01</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-medium">
                            {item % 2 === 0 ? 'MD' : 'AS'}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-700">{item % 2 === 0 ? 'Marie Diop' : 'Amadou Sow'}</p>
                            <p className="text-xs text-gray-500">Tel: +221 77 {item}00 00 00</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">10/0{item}/2024</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="bg-primary-100 text-primary-700 text-xs px-2.5 py-1 rounded-full">{item+2}/5</span>
                          <button className="ml-2 text-primary-600 hover:text-primary-800 text-xs underline transition-colors">
                            Voir fichiers
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          item % 3 === 0 ? 'bg-amber-100 text-amber-700' :
                          item % 3 === 1 ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item % 3 === 0 ? 'En attente' :
                          item % 3 === 1 ? 'Validée' : 'Documents manquants'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Affichage de 1 à 5 sur 8 demandes d'adhésion
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Précédent
                </button>
                <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            {/* Sélecteur de période */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">Période d'analyse</h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">7 jours</button>
                  <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all">30 jours</button>
                  <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">3 mois</button>
                  <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-md">12 mois</button>
                </div>
              </div>
            </div>

            {/* Graphiques de performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200">
                  <h3 className="font-medium text-slate-800">Investissements par GIE</h3>
                </div>
                <div className="p-5 h-80 flex items-center justify-center">
                  <p className="text-slate-500 text-sm">Graphique d'investissements par GIE</p>
                  {/* Emplacement pour un graphique */}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200">
                  <h3 className="font-medium text-slate-800">Évolution des adhésions</h3>
                </div>
                <div className="p-5 h-80 flex items-center justify-center">
                  <p className="text-slate-500 text-sm">Graphique d'évolution des adhésions</p>
                  {/* Emplacement pour un graphique */}
                </div>
              </div>
            </div>

            {/* Tableau récapitulatif */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="font-medium text-slate-800">Récapitulatif financier</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-6 py-4 font-medium">Région</th>
                      <th className="px-6 py-4 font-medium">GIE actifs</th>
                      <th className="px-6 py-4 font-medium">Membres</th>
                      <th className="px-6 py-4 font-medium">Investissement</th>
                      <th className="px-6 py-4 font-medium">Progression</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack'].map((region, index) => (
                      <tr key={region} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{region}</td>
                        <td className="px-6 py-4 text-gray-600">{(index + 1) * 3}</td>
                        <td className="px-6 py-4 text-gray-600">{(index + 1) * 15}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{(index + 1) * 250000} FCFA</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-green-600">+{(index + 1) * 7}%</span>
                            <TrendingUp className="w-4 h-4 ml-1 text-green-600" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end">
                <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all">
                  <span>Exporter en Excel</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-medium text-gray-800">Paramètres de la plateforme</h3>
              </div>
              <div className="p-6 divide-y divide-gray-100">
                {[
                  { name: 'Paramètres généraux', desc: 'Configurations générales de la plateforme' },
                  { name: 'Sécurité', desc: 'Gestion des accès et autorisations' },
                  { name: 'Notifications', desc: 'Configuration des alertes et messages' },
                  { name: 'Intégrations', desc: 'Services tiers et API externes' }
                ].map((setting, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">{setting.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{setting.desc}</p>
                      </div>
                      <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50">
                        Configurer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="font-medium text-slate-800">Administrateurs système</h3>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                          {item === 1 ? 'AD' : item === 2 ? 'OS' : 'MB'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-slate-800">
                            {item === 1 ? 'Abdoulaye Diop' : item === 2 ? 'Ousmane Sy' : 'Mariama Ba'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item === 1 ? 'Admin principal' : item === 2 ? 'Gestionnaire GIE' : 'Support technique'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-slate-200 flex justify-end">
                  <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Ajouter administrateur</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Sidebar Header with Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800">FEVEO 2050</span>
          </div>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="px-3 mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Principal
            </h3>
          </div>
          
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className={`w-5 h-5 mr-3 ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'}`} />
              Tableau de bord
            </button>

            <button
              onClick={() => setActiveTab('gie')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'gie' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building className={`w-5 h-5 mr-3 ${activeTab === 'gie' ? 'text-white' : 'text-gray-400'}`} />
              Gestion des GIE
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'users' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className={`w-5 h-5 mr-3 ${activeTab === 'users' ? 'text-white' : 'text-gray-400'}`} />
              Utilisateurs
            </button>

            <button
              onClick={() => setActiveTab('adhesions')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'adhesions' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className={`w-5 h-5 mr-3 ${activeTab === 'adhesions' ? 'text-white' : 'text-gray-400'}`} />
              Adhésions
            </button>
            
            <div className="px-3 pt-6 pb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Analyse et Gestion
              </h3>
            </div>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'reports' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className={`w-5 h-5 mr-3 ${activeTab === 'reports' ? 'text-white' : 'text-gray-400'}`} />
              Rapports
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'settings' 
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className={`w-5 h-5 mr-3 ${activeTab === 'settings' ? 'text-white' : 'text-gray-400'}`} />
              Paramètres
            </button>
          </nav>
        </div>
        
        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
              {admin?.prenom?.charAt(0)}{admin?.nom?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{admin?.prenom} {admin?.nom}</p>
              <p className="text-xs text-gray-500">{admin?.role || 'Administrateur'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="ml-auto p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          {/* Mobile Menu Button - visible only on small screens */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18"></path>
              </svg>
            </button>
          </div>
          
          {/* Page Title - dynamically changes based on active tab */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === 'dashboard' ? 'Tableau de bord' :
               activeTab === 'gie' ? 'Gestion des GIE' :
               activeTab === 'users' ? 'Gestion des utilisateurs' :
               activeTab === 'adhesions' ? 'Gestion des adhésions' :
               activeTab === 'reports' ? 'Rapports et analyses' :
               'Paramètres système'}
            </h1>
            {activeTab === 'dashboard' && (
              <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                Admin
              </span>
            )}
          </div>

          {/* Right-side Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="relative p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full"></span>
              </button>
            </div>
            
            {/* User Profile - visible only on mobile */}
            <div className="md:hidden">
              <button className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600 text-white">
                {admin?.prenom?.charAt(0)}{admin?.nom?.charAt(0)}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Content Header with Description */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeTab === 'dashboard' ? 'Vue d\'ensemble' :
                 activeTab === 'gie' ? 'Liste des GIE' :
                 activeTab === 'users' ? 'Utilisateurs du système' :
                 activeTab === 'adhesions' ? 'Demandes d\'adhésion' :
                 activeTab === 'reports' ? 'Rapports et statistiques' :
                 'Configuration système'}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {activeTab === 'dashboard' 
                  ? `Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})} à ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}`
                  : 'Gérez efficacement votre plateforme FEVEO 2050'
                }
              </p>
            </div>
            
            <div>
              {activeTab !== 'dashboard' && (
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Plus className="w-4 h-4 mr-2" />
                  {activeTab === 'gie' ? 'Nouveau GIE' :
                   activeTab === 'users' ? 'Ajouter utilisateur' :
                   activeTab === 'adhesions' ? 'Nouvelle adhésion' :
                   activeTab === 'reports' ? 'Générer rapport' :
                   'Ajouter paramètre'}
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Content */}
          {renderDashboardContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
