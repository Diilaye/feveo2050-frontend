import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminStats = [
    { label: 'GIE Actifs', value: '24', icon: Building, color: 'blue-900', trend: '+12%' },
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
      case 'dashboard':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {adminStats.map((stat, index) => (
                <div key={index} className={`bg-${stat.color} text-white p-6 rounded-xl relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/80 text-sm">{stat.label}</p>
                    <stat.icon className="w-6 h-6 text-white/60" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-white/70" />
                    <span className="text-white/70 text-sm">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Activité récente</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}>
                            <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.status === 'pending' ? 'En attente' :
                             activity.status === 'approved' ? 'Validé' : 'Actif'}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Tâches en attente</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority === 'high' ? 'Urgent' :
                                 task.priority === 'medium' ? 'Moyen' : 'Faible'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <p className="text-xs text-gray-500">Échéance: {task.deadline}</p>
                          </div>
                          <button className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'gie':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Gestion des GIE</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nouveau GIE</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-8">Interface de gestion des GIE en développement...</p>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Gestion des utilisateurs</h3>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-8">Interface de gestion des utilisateurs en développement...</p>
            </div>
          </div>
        );

      case 'adhesions':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Gestion des adhésions</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-8">Interface de gestion des adhésions en développement...</p>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Rapports et analyses</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-8">Interface de rapports en développement...</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Paramètres système</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-8">Interface de paramètres en développement...</p>
            </div>
          </div>
        );

      default:
        return null;
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
              <h1 className="text-lg font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-600">FEVEO 2050 - Interface d'administration</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.prenom} {user?.nom}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
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
              onClick={() => setActiveTab('dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 bg-orange-500 text-white"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            {[
              { id: 'gie', name: 'Gérer GIE', icon: Building },
              { id: 'users', name: 'Utilisateurs', icon: Users },
              { id: 'adhesions', name: 'Adhésions', icon: FileText },
              { id: 'reports', name: 'Rapports', icon: TrendingUp },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'dashboard' ? 'Vue d\'ensemble' :
               activeTab === 'gie' ? 'Gestion des GIE' :
               activeTab === 'users' ? 'Gestion des utilisateurs' :
               activeTab === 'adhesions' ? 'Gestion des adhésions' :
               activeTab === 'reports' ? 'Rapports et analyses' :
               'Paramètres système'}
            </h2>
            <p className="text-sm text-gray-600">
              {activeTab === 'dashboard' 
                ? `Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}`
                : 'Gérez efficacement votre plateforme FEVEO 2050'
              }
            </p>
          </div>

          {/* Dynamic Content */}
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
