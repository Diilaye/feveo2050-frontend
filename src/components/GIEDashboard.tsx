import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  Package, 
  Users, 
  Activity, 
  Settings, 
  LogOut, 
  Eye, 
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  FileText,
  Camera,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

const GIEDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    gieId: '',
    password: ''
  });

  // États pour les différentes sections
  const [gieInfo, setGieInfo] = useState({
    id: 'FEVEO-GIE-DK-001-2024',
    nom: 'GIE Ndèye Fatou',
    presidenteNom: 'Fatou Diop',
    region: 'Dakar',
    commune: 'Parcelles Assainies',
    dateCreation: '2024-01-15',
    nombreMembres: 25,
    statut: 'Actif'
  });

  const [walletData, setWalletData] = useState({
    solde: 2450000,
    partsInvesties: 245,
    rendement: 12.5,
    derniereTransaction: '2024-03-15',
    transactions: [
      { id: 1, date: '2024-03-15', type: 'Crédit', montant: 150000, description: 'Vente produits agricoles' },
      { id: 2, date: '2024-03-10', type: 'Débit', montant: 50000, description: 'Achat semences' },
      { id: 3, date: '2024-03-05', type: 'Crédit', montant: 200000, description: 'Rendement investissement' }
    ]
  });

  const [products, setProducts] = useState([
    { id: 1, nom: 'Tomates Bio', prix: 1500, stock: 150, categorie: 'Légumes', image: null },
    { id: 2, nom: 'Oignons', prix: 800, stock: 200, categorie: 'Légumes', image: null },
    { id: 3, nom: 'Huile d\'arachide', prix: 2500, stock: 50, categorie: 'Transformation', image: null }
  ]);

  const [activities, setActivities] = useState([
    { id: 1, titre: 'Récolte de tomates', date: '2024-03-20', statut: 'Planifiée', description: 'Récolte de la saison' },
    { id: 2, titre: 'Formation compostage', date: '2024-03-18', statut: 'Terminée', description: 'Formation sur le compostage' }
  ]);

  const [members, setMembers] = useState([
    { id: 1, nom: 'Fatou Diop', role: 'Présidente', telephone: '+221 77 123 45 67', email: 'fatou@example.com', dateAdhesion: '2024-01-15' },
    { id: 2, nom: 'Awa Ndiaye', role: 'Secrétaire', telephone: '+221 76 234 56 78', email: 'awa@example.com', dateAdhesion: '2024-01-15' }
  ]);

  // États pour les modals
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showStatutsForm, setShowStatutsForm] = useState(false);

  // États pour les formulaires
  const [newProduct, setNewProduct] = useState({
    nom: '', prix: '', stock: '', categorie: '', description: '', image: null
  });

  const [newActivity, setNewActivity] = useState({
    titre: '', date: '', description: '', lieu: ''
  });

  const [newMember, setNewMember] = useState({
    nom: '', prenom: '', dateNaissance: '', lieuNaissance: '', cin: '', adresse: '', telephone: '', email: '', role: 'Membre'
  });

  const [statutsData, setStatutsData] = useState({
    date: new Date().toISOString().split('T')[0],
    region: '',
    departement: '',
    arrondissement: '',
    commune: '',
    membres: Array(40).fill(null).map((_, i) => ({
      id: i + 1,
      prenomNom: '',
      dateNaissance: '',
      lieuNaissance: '',
      cin: '',
      adresse: '',
      signature: false
    }))
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.gieId && loginData.password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ gieId: '', password: '' });
  };

  const handleAddProduct = () => {
    if (newProduct.nom && newProduct.prix && newProduct.stock) {
      setProducts([...products, {
        id: Date.now(),
        ...newProduct,
        prix: parseFloat(newProduct.prix),
        stock: parseInt(newProduct.stock)
      }]);
      setNewProduct({ nom: '', prix: '', stock: '', categorie: '', description: '', image: null });
      setShowAddProduct(false);
    }
  };

  const handleAddActivity = () => {
    if (newActivity.titre && newActivity.date) {
      setActivities([...activities, {
        id: Date.now(),
        ...newActivity,
        statut: 'Planifiée'
      }]);
      setNewActivity({ titre: '', date: '', description: '', lieu: '' });
      setShowAddActivity(false);
    }
  };

  const handleAddMember = () => {
    if (newMember.nom && newMember.prenom && newMember.telephone) {
      setMembers([...members, {
        id: Date.now(),
        nom: `${newMember.prenom} ${newMember.nom}`,
        ...newMember,
        dateAdhesion: new Date().toISOString().split('T')[0]
      }]);
      setNewMember({ nom: '', prenom: '', dateNaissance: '', lieuNaissance: '', cin: '', adresse: '', telephone: '', email: '', role: 'Membre' });
      setShowAddMember(false);
    }
  };

  const generateStatutsPDF = () => {
    // Ici vous ajouteriez la logique pour générer le PDF des statuts
    alert('Génération du PDF des statuts en cours...');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-neutral-50" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Connexion GIE</h2>
              <p className="text-neutral-600">Accédez à votre dashboard FEVEO 2050</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  ID du GIE *
                </label>
                <input
                  type="text"
                  value={loginData.gieId}
                  onChange={(e) => setLoginData(prev => ({ ...prev, gieId: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                  placeholder="FEVEO-GIE-XXXX-YYYY"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 pr-12"
                    placeholder="Mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full btn-accent py-3">
                Se connecter
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-accent-500 hover:text-accent-600">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-neutral-50 border-b border-neutral-200">
        <div className="container-max section-padding">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-neutral-50 font-bold">F</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">Dashboard GIE</h1>
                <p className="text-sm text-neutral-600">{gieInfo.nom}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900">{gieInfo.presidenteNom}</p>
                <p className="text-xs text-neutral-500">Présidente</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-600 hover:text-red-500 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-max section-padding py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card p-4">
              <nav className="space-y-2">
                {[
                  { id: 'wallet', label: 'Wallet GIE', icon: Wallet },
                  { id: 'products', label: 'Produits', icon: Package },
                  { id: 'activities', label: 'Activités', icon: Activity },
                  { id: 'members', label: 'Membres', icon: Users },
                  { id: 'settings', label: 'Paramètres', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === item.id
                        ? 'bg-accent-500 text-neutral-50'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Wallet GIE</h2>
                  <div className="text-sm text-neutral-500">
                    Dernière mise à jour: {walletData.derniereTransaction}
                  </div>
                </div>

                {/* Wallet Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card bg-primary-500 text-neutral-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">Solde Total</p>
                        <p className="text-2xl font-bold">{walletData.solde.toLocaleString()} FCFA</p>
                      </div>
                      <Wallet className="w-8 h-8 opacity-80" />
                    </div>
                  </div>

                  <div className="card bg-success-500 text-neutral-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">Parts Investies</p>
                        <p className="text-2xl font-bold">{walletData.partsInvesties}</p>
                      </div>
                      <CreditCard className="w-8 h-8 opacity-80" />
                    </div>
                  </div>

                  <div className="card bg-accent-500 text-neutral-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">Rendement</p>
                        <p className="text-2xl font-bold">{walletData.rendement}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 opacity-80" />
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="card">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">Dernières Transactions</h3>
                  <div className="space-y-3">
                    {walletData.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg">
                        <div>
                          <p className="font-medium text-neutral-900">{transaction.description}</p>
                          <p className="text-sm text-neutral-500">{transaction.date}</p>
                        </div>
                        <div className={`font-bold ${
                          transaction.type === 'Crédit' ? 'text-success-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'Crédit' ? '+' : '-'}{transaction.montant.toLocaleString()} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Gestion des Produits</h2>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="btn-accent flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter Produit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-neutral-900">{product.nom}</h3>
                        <div className="flex space-x-2">
                          <button className="p-1 text-neutral-400 hover:text-accent-500">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-neutral-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Prix:</span>
                          <span className="font-medium">{product.prix.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Stock:</span>
                          <span className="font-medium">{product.stock} unités</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Catégorie:</span>
                          <span className="font-medium">{product.categorie}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <button className="w-full btn-secondary text-sm py-2">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Gérer les ventes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Activités du GIE</h2>
                  <button
                    onClick={() => setShowAddActivity(true)}
                    className="btn-accent flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nouvelle Activité</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="card">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-neutral-900">{activity.titre}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.statut === 'Terminée' 
                                ? 'bg-success-100 text-success-600'
                                : activity.statut === 'En cours'
                                ? 'bg-accent-100 text-accent-600'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}>
                              {activity.statut}
                            </span>
                          </div>
                          <p className="text-neutral-600 mb-2">{activity.description}</p>
                          <div className="flex items-center text-sm text-neutral-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {activity.date}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-neutral-400 hover:text-accent-500">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-neutral-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Gestion des Membres</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowStatutsForm(true)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Statuts GIE</span>
                    </button>
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="btn-accent flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Ajouter Membre</span>
                    </button>
                  </div>
                </div>

                <div className="card">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-4 font-medium text-neutral-700">Nom</th>
                          <th className="text-left py-3 px-4 font-medium text-neutral-700">Rôle</th>
                          <th className="text-left py-3 px-4 font-medium text-neutral-700">Contact</th>
                          <th className="text-left py-3 px-4 font-medium text-neutral-700">Adhésion</th>
                          <th className="text-left py-3 px-4 font-medium text-neutral-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member) => (
                          <tr key={member.id} className="border-b border-neutral-100">
                            <td className="py-3 px-4">
                              <div className="font-medium text-neutral-900">{member.nom}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                member.role === 'Présidente' 
                                  ? 'bg-primary-100 text-primary-600'
                                  : member.role === 'Secrétaire'
                                  ? 'bg-accent-100 text-accent-600'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}>
                                {member.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-neutral-600">
                                <div className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {member.telephone}
                                </div>
                                {member.email && (
                                  <div className="flex items-center mt-1">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {member.email}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-neutral-600">
                              {member.dateAdhesion}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button className="p-1 text-neutral-400 hover:text-accent-500">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-neutral-400 hover:text-red-500">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900">Paramètres du GIE</h2>

                <div className="card">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">Informations Générales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        ID du GIE
                      </label>
                      <input
                        type="text"
                        value={gieInfo.id}
                        disabled
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Nom du GIE
                      </label>
                      <input
                        type="text"
                        value={gieInfo.nom}
                        onChange={(e) => setGieInfo(prev => ({ ...prev, nom: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Région
                      </label>
                      <input
                        type="text"
                        value={gieInfo.region}
                        onChange={(e) => setGieInfo(prev => ({ ...prev, region: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Commune
                      </label>
                      <input
                        type="text"
                        value={gieInfo.commune}
                        onChange={(e) => setGieInfo(prev => ({ ...prev, commune: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="btn-accent">
                      <Save className="w-5 h-5 mr-2" />
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Add Product */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-neutral-50 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Ajouter un Produit</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={newProduct.nom}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Ex: Tomates Bio"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.prix}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, prix: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="1500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={newProduct.categorie}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, categorie: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Légumes">Légumes</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Céréales">Céréales</option>
                  <option value="Transformation">Transformation</option>
                  <option value="Artisanat">Artisanat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Description du produit..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddProduct(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProduct}
                className="btn-accent"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Activity */}
      {showAddActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-neutral-50 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Nouvelle Activité</h3>
              <button
                onClick={() => setShowAddActivity(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Titre de l'activité *
                </label>
                <input
                  type="text"
                  value={newActivity.titre}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, titre: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Ex: Formation compostage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Lieu
                </label>
                <input
                  type="text"
                  value={newActivity.lieu}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, lieu: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Lieu de l'activité"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newActivity.description}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Description de l'activité..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddActivity(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleAddActivity}
                className="btn-accent"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Member */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-neutral-50 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Ajouter un Membre</h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={newMember.prenom}
                  onChange={(e) => setNewMember(prev => ({ ...prev, prenom: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={newMember.nom}
                  onChange={(e) => setNewMember(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Nom de famille"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={newMember.dateNaissance}
                  onChange={(e) => setNewMember(prev => ({ ...prev, dateNaissance: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  value={newMember.lieuNaissance}
                  onChange={(e) => setNewMember(prev => ({ ...prev, lieuNaissance: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Lieu de naissance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Numéro CIN
                </label>
                <input
                  type="text"
                  value={newMember.cin}
                  onChange={(e) => setNewMember(prev => ({ ...prev, cin: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Numéro CIN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={newMember.telephone}
                  onChange={(e) => setNewMember(prev => ({ ...prev, telephone: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="+221 XX XXX XX XX"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="email@exemple.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Adresse
                </label>
                <textarea
                  rows={2}
                  value={newMember.adresse}
                  onChange={(e) => setNewMember(prev => ({ ...prev, adresse: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Adresse complète"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Rôle
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                >
                  <option value="Membre">Membre</option>
                  <option value="Secrétaire">Secrétaire</option>
                  <option value="Trésorière">Trésorière</option>
                  <option value="Commissaire aux comptes">Commissaire aux comptes</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddMember(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleAddMember}
                className="btn-accent"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Statuts Form */}
      {showStatutsForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-neutral-50 rounded-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Statuts du Groupement d'Intérêt Économique</h3>
              <button
                onClick={() => setShowStatutsForm(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* En-tête du document */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  STATUT D'UN GROUPEMENT D'INTERET ECONOMIQUE
                </h2>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span>Aujourd'hui,</span>
                  <input
                    type="date"
                    value={statutsData.date}
                    onChange={(e) => setStatutsData(prev => ({ ...prev, date: e.target.value }))}
                    className="px-3 py-1 border border-neutral-300 rounded"
                  />
                </div>
              </div>

              {/* Localisation */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Dans la région de :
                  </label>
                  <input
                    type="text"
                    value={statutsData.region}
                    onChange={(e) => setStatutsData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Région"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    département de :
                  </label>
                  <input
                    type="text"
                    value={statutsData.departement}
                    onChange={(e) => setStatutsData(prev => ({ ...prev, departement: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Département"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    arrondissement de :
                  </label>
                  <input
                    type="text"
                    value={statutsData.arrondissement}
                    onChange={(e) => setStatutsData(prev => ({ ...prev, arrondissement: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Arrondissement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    commune de :
                  </label>
                  <input
                    type="text"
                    value={statutsData.commune}
                    onChange={(e) => setStatutsData(prev => ({ ...prev, commune: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Commune"
                  />
                </div>
              </div>

              {/* Tableau des membres */}
              <div>
                <h4 className="text-lg font-bold text-neutral-900 mb-4">Les soussignés,</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-neutral-300">
                    <thead>
                      <tr className="bg-neutral-100">
                        <th className="border border-neutral-300 px-2 py-2 text-xs font-medium">N°</th>
                        <th className="border border-neutral-300 px-2 py-2 text-xs font-medium">Prénoms & Noms</th>
                        <th className="border border-neutral-300 px-2 py-2 text-xs font-medium">Date et lieu de naissance</th>
                        <th className="border border-neutral-300 px-2 py-2 text-xs font-medium">CIN N°</th>
                        <th className="border border-neutral-300 px-2 py-2 text-xs font-medium">Adresse</th>
                        <th className="border border-neutral-300 px-2 py-2 text-xs font-medium">Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statutsData.membres.map((membre, index) => (
                        <tr key={index}>
                          <td className="border border-neutral-300 px-2 py-1 text-center text-sm">
                            {String(index + 1).padStart(2, '0')}
                          </td>
                          <td className="border border-neutral-300 px-2 py-1">
                            <input
                              type="text"
                              value={membre.prenomNom}
                              onChange={(e) => {
                                const newMembres = [...statutsData.membres];
                                newMembres[index].prenomNom = e.target.value;
                                setStatutsData(prev => ({ ...prev, membres: newMembres }));
                              }}
                              className="w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-accent-500"
                              placeholder="Prénom et Nom"
                            />
                          </td>
                          <td className="border border-neutral-300 px-2 py-1">
                            <input
                              type="text"
                              value={membre.dateNaissance}
                              onChange={(e) => {
                                const newMembres = [...statutsData.membres];
                                newMembres[index].dateNaissance = e.target.value;
                                setStatutsData(prev => ({ ...prev, membres: newMembres }));
                              }}
                              className="w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-accent-500"
                              placeholder="Date et lieu"
                            />
                          </td>
                          <td className="border border-neutral-300 px-2 py-1">
                            <input
                              type="text"
                              value={membre.cin}
                              onChange={(e) => {
                                const newMembres = [...statutsData.membres];
                                newMembres[index].cin = e.target.value;
                                setStatutsData(prev => ({ ...prev, membres: newMembres }));
                              }}
                              className="w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-accent-500"
                              placeholder="N° CIN"
                            />
                          </td>
                          <td className="border border-neutral-300 px-2 py-1">
                            <input
                              type="text"
                              value={membre.adresse}
                              onChange={(e) => {
                                const newMembres = [...statutsData.membres];
                                newMembres[index].adresse = e.target.value;
                                setStatutsData(prev => ({ ...prev, membres: newMembres }));
                              }}
                              className="w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-accent-500"
                              placeholder="Adresse"
                            />
                          </td>
                          <td className="border border-neutral-300 px-2 py-1 text-center">
                            <input
                              type="checkbox"
                              checked={membre.signature}
                              onChange={(e) => {
                                const newMembres = [...statutsData.membres];
                                newMembres[index].signature = e.target.checked;
                                setStatutsData(prev => ({ ...prev, membres: newMembres }));
                              }}
                              className="w-4 h-4 text-accent-500 focus:ring-accent-500 border-neutral-300 rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Articles des statuts */}
              <div className="space-y-4 text-sm">
                <p className="font-medium">
                  Ont établi ainsi les statuts d'un GROUPEMENT D'INTERET ECONOMIQUE qu'elles(qu'ils) proposent de constituer.
                </p>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-bold">ARTICLE 1- FORME :</h5>
                    <p>Il est formé entre les soussignés, un GROUPEMENT D'INTERET ECONOMIQUE qui sera régi par les lois en vigueur et par les présents statuts.</p>
                  </div>

                  <div>
                    <h5 className="font-bold">ARTICLE 2- OBJET :</h5>
                    <p>Le GROUPEMENT D'INTERET ECONOMIQUE a pour objet :</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>prestation de services en qualité de distributeur de Fintech de « FEVEO DIGITAL FINANCE » et produits dérivés</li>
                      <li>commerce et distribution de produits agroalimentaires et autres en détail, au niveau territorial (affilié de la grande distribution « AVEC FEVEO DISTRIBUTION »)</li>
                      <li>exploitation des ressources du secteur primaire</li>
                      <li>transformation des ressources du secteur primaire et/ou secondaire</li>
                      <li>multiservices</li>
                      <li>restauration et services traiteur</li>
                      <li>cadre de vie</li>
                      <li>divers</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold">ARTICLE 3- DENOMINATION SOCIALE :</h5>
                    <p>La dénomination sociale du groupement est FEMMES VISION ECONOMIE ORGANIQUE +code région+code département+code arrondissement+code commune+n°de protocole d'adhésion à la plateforme FEVEO 2050 dans la commune « FEVEO ………….. »</p>
                    <p>Dans tous les actes et documents émanant du groupement d'intérêt Economique cette dénomination devra toujours être mentionnée suivie du mot "Groupement d'Intérêt Economique" régi par l'Acte Uniforme OHADA relatif au droit des sociétés Commerciales et du Groupement d'intérêt Economique.</p>
                  </div>

                  {/* Autres articles... */}
                  <div>
                    <h5 className="font-bold">ARTICLE 6 – APPORTS :</h5>
                    <p>Chaque membre du GIE doit apporter la somme de 273 900 f.cfa (deux cent soixante-treize mille neuf cents) à libérer par une somme minimale mensuelle de 4500 f au 05 de chaque mois jusqu'à la libération totale du montant, ne dépassant pas la date limite du 19 février 2030.</p>
                  </div>

                  <div>
                    <h5 className="font-bold">ARTICLE 7 – CAPITAL SOCIAL :</h5>
                    <p>Le capital social : 10 956 000 F.CFA dont 60 000 (soixante mille francs) entièrement libérés à la date de constitution (à raison de 1 500 f.cfa par membre)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-neutral-200">
              <button
                onClick={() => setShowStatutsForm(false)}
                className="btn-secondary"
              >
                Fermer
              </button>
              <button
                onClick={generateStatutsPDF}
                className="btn-accent flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Générer PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GIEDashboard;