import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clipboard, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Users,
  Building,
  Shield,
  DollarSign,
  Eye,
  Plus,
  Edit,
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
    adresse?: string;
  };
  secretaire?: {
    telephone?: string;
    nom?: string;
    prenom?: string;
  };
  tresoriere?: {
    telephone?: string;
    nom?: string;
    prenom?: string;
  };
  membres?: Array<{
    _id: string;
    nom: string;
    prenom: string;
    telephone: string;
    fonction: string;
  }>;
  documents?: Array<{
    _id: string;
    nom: string;
    type: string;
    url: string;
    dateUpload: string;
  }>;
  activites?: string[];
  historique?: Array<{
    action: string;
    date: string;
    utilisateur: string;
    details?: string;
  }>;
}

const GIEDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAdminAuthContext();
  
  const [gie, setGie] = useState<GIE | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('informations');
  
  useEffect(() => {
    const fetchGIEDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('adminAuthToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }
        
        const response = await axios.get<{success: boolean, data: GIE, message?: string}>(`/admin/gies/${id}`, {
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log(response.data);

        if (response.data && response.data.success) {
          setGie(response.data.data);
        } else {
          setError(response.data?.message || 'Erreur lors du chargement des données du GIE');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des détails du GIE:', err);
        setError('Impossible de charger les informations du GIE. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGIEDetails();
  }, [id, navigate]);
  
  const activerAdhesion = async () => {
    if (!gie) return;
    
    try {
      const token = localStorage.getItem('adminAuthToken');
      
      const response = await axios.post<{ success: boolean, message: string }>(
        `/admin/gies/${gie._id}/activer-adhesion`, 
        {},
        {
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        alert(response.data.message || 'Adhésion activée avec succès !');
        // Recharger les détails du GIE
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation de l\'adhésion:', error);
      alert('Erreur lors de l\'activation de l\'adhésion');
    }
  };
  
  const renderStatusBadge = (status: string, type: 'adhesion' | 'enregistrement') => {
    let bgColor = 'bg-gray-100 text-gray-700';
    let text = 'Inconnu';
    
    if (type === 'adhesion') {
      if (status === 'validee') {
        bgColor = 'bg-green-100 text-green-600';
        text = 'Validée';
      } else if (status === 'en_attente') {
        bgColor = 'bg-amber-100 text-amber-600';
        text = 'En attente';
      } else {
        bgColor = 'bg-red-100 text-red-600';
        text = 'Non validée';
      }
    } else {
      if (status === 'valide') {
        bgColor = 'bg-green-100 text-green-600';
        text = 'Valide';
      } else {
        bgColor = 'bg-amber-100 text-amber-600';
        text = 'En attente';
      }
    }
    
    return (
      <span className={`inline-flex text-xs font-medium rounded-full px-3 py-1 ${bgColor}`}>
        {text}
      </span>
    );
  };
  
  const renderTabContent = () => {
    if (!gie) return null;
    
    switch (activeTab) {
      case 'informations':
        return (
          <div className="bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100">
            {/* Statut et informations clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-50 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Statut d'adhésion</h3>
                  {renderStatusBadge(gie.statutAdhesion, 'adhesion')}
                </div>
                <p className="text-sm text-gray-500">
                  {gie.statutAdhesion === 'validee' 
                    ? 'Le GIE est pleinement opérationnel et peut réaliser des opérations financières.' 
                    : 'Le GIE est en attente de validation pour devenir pleinement opérationnel.'}
                </p>
              </div>
              
              <div className="bg-primary-50 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Statut d'enregistrement</h3>
                  {renderStatusBadge(gie.statutEnregistrement, 'enregistrement')}
                </div>
                <p className="text-sm text-gray-500">
                  {gie.statutEnregistrement === 'valide' 
                    ? 'Tous les documents d\'enregistrement du GIE ont été validés.' 
                    : 'Certains documents d\'enregistrement sont en attente de validation.'}
                </p>
              </div>
              
              <div className="bg-primary-50 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-sm font-semibold text-gray-700">Informations clés</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Date de création:</span>
                    <span className="text-sm font-medium">{new Date(gie.dateCreation).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Identifiant:</span>
                    <span className="text-sm font-medium">{gie.identifiantGIE}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carte d'informations détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Localisation */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-primary-50 px-5 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Localisation</h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Région</p>
                      <p className="text-sm font-medium">{gie.region}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Département</p>
                      <p className="text-sm font-medium">{gie.departement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Commune</p>
                      <p className="text-sm font-medium">{gie.commune}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Direction du GIE */}
              {gie.presidente && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-primary-50 px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-primary-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Présidente</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-lg mr-4">
                        {(gie.presidente.prenom?.charAt(0) || '') + (gie.presidente.nom?.charAt(0) || '')}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {gie.presidente.prenom || ''} {gie.presidente.nom || ''}
                        </h4>
                        <p className="text-xs text-primary-600 font-medium">Présidente du GIE</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center p-2 rounded-lg bg-gray-50">
                        <Phone className="w-4 h-4 text-gray-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Téléphone</p>
                          <p className="text-sm font-medium">{gie.presidente.telephone || 'Non renseigné'}</p>
                        </div>
                      </div>
                      
                      {gie.presidente.adresse && (
                        <div className="flex items-center p-2 rounded-lg bg-gray-50">
                          <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Adresse</p>
                            <p className="text-sm font-medium">{gie.presidente.adresse}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Actions du bas */}
            <div className="mt-8 flex justify-end">
              {(gie.statutAdhesion !== 'validee' || gie.statutEnregistrement !== 'valide') && (
                <button 
                  onClick={activerAdhesion}
                  className="flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-sm transition-all ml-3"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Activer l'adhésion du GIE
                </button>
              )}
            </div>
          </div>
        );
        
      case 'membres':
        return (
          <div className="bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary-600" />
                Membres du GIE
              </h3>
              <div className="flex items-center">
                <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-lg text-sm font-medium">
                  {gie.membres ? gie.membres.length : 0} membres
                </span>
              </div>
            </div>
            
            {/* Légende des rôles */}
            <div className="flex flex-wrap gap-3 mb-6 bg-primary-50 p-3 rounded-lg border border-primary-100">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-xs font-medium text-gray-700">Présidente</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs font-medium text-gray-700">Secrétaire</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs font-medium text-gray-700">Trésorière</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-xs font-medium text-gray-700">Membre</span>
              </div>
            </div>
            
            {!gie.membres || gie.membres.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-1">Aucun membre enregistré</p>
                <p className="text-sm text-gray-400">Le GIE n'a pas encore de membres dans sa base de données.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gie.membres.map((membre) => {
                  // Déterminer les couleurs et icônes basées sur le rôle
                  let bgColor = "bg-gray-100";
                  let textColor = "text-gray-700";
                  let borderColor = "border-gray-200";
                  let iconComponent = <Users className="w-5 h-5" />;
                  
                  if (membre.fonction === 'Présidente') {
                    bgColor = "bg-purple-50";
                    textColor = "text-purple-700";
                    borderColor = "border-purple-200";
                    iconComponent = <Shield className="w-5 h-5 text-purple-600" />;
                  } else if (membre.fonction === 'Secrétaire') {
                    bgColor = "bg-blue-50";
                    textColor = "text-blue-700";
                    borderColor = "border-blue-200";
                    iconComponent = <FileText className="w-5 h-5 text-blue-600" />;
                  } else if (membre.fonction === 'Trésorière') {
                    bgColor = "bg-green-50";
                    textColor = "text-green-700"; 
                    borderColor = "border-green-200";
                    iconComponent = <DollarSign className="w-5 h-5 text-green-600" />;
                  }

                  const roleName = membre.fonction === 'Présidente' 
                    ? 'Présidente' 
                    : membre.fonction === 'secretaire'
                    ? 'Secrétaire'
                    : membre.fonction === 'tresoriere'
                    ? 'Trésorière'
                    : 'Membre';
                    
                  return (
                    <div key={membre._id} className={`rounded-xl border ${borderColor} overflow-hidden shadow-sm`}>
                      <div className={`${bgColor} px-4 py-3 border-b ${borderColor} flex justify-between items-center`}>
                        <div className="flex items-center">
                          {iconComponent}
                          <span className={`ml-2 text-sm font-semibold ${textColor}`}>{membre.fonction}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm mr-3">
                            {membre.prenom.charAt(0)}{membre.nom.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{membre.prenom} {membre.nom}</h4>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-gray-600 text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{membre.telephone}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      case 'documents':
        return (
          <div className="bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                Documents du GIE
              </h3>
              <div className="flex items-center">
                <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-lg text-sm font-medium">
                  {gie.documents ? gie.documents.length : 0} documents
                </span>
              </div>
            </div>
            
            {!gie.documents || gie.documents.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-1">Aucun document disponible</p>
                <p className="text-sm text-gray-400">Le GIE n'a pas encore de documents dans sa base de données.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gie.documents.map((document) => {
                  // Déterminer l'icône en fonction du type de document
                  const getFileIcon = () => {
                    const type = document.type.toLowerCase();
                    if (type.includes('pdf')) return <FileText className="w-10 h-10 text-red-500" />;
                    if (type.includes('image') || type.includes('photo') || type.includes('jpeg') || type.includes('png')) 
                      return <FileText className="w-10 h-10 text-green-500" />;
                    if (type.includes('doc') || type.includes('word')) 
                      return <FileText className="w-10 h-10 text-blue-500" />;
                    return <FileText className="w-10 h-10 text-gray-500" />;
                  };
                  
                  return (
                    <div key={document._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                      <div className="p-5 flex flex-col items-center justify-center text-center border-b border-gray-100">
                        {getFileIcon()}
                        <h4 className="font-medium text-gray-800 mt-3 mb-1">{document.nom}</h4>
                        <span className="inline-flex text-xs font-medium rounded-full px-3 py-1 bg-blue-100 text-blue-700">
                          {document.type}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Ajouté le {new Date(document.dateUpload).toLocaleDateString('fr-FR')}
                        </div>
                        <a 
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Visualiser
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      case 'historique':
        return (
          <div className="bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                Historique du GIE
              </h3>
              <div className="flex items-center">
                <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-lg text-sm font-medium">
                  {gie.historique ? gie.historique.length : 0} événements
                </span>
              </div>
            </div>
            
            {!gie.historique || gie.historique.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                <Clock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-1">Aucun événement enregistré</p>
                <p className="text-sm text-gray-400">L'historique des actions du GIE sera visible ici.</p>
              </div>
            ) : (
              <div className="relative py-6 pl-8 border-l-2 border-primary-200">
                {gie.historique.map((item, index) => {
                  // Déterminer l'icône et les couleurs en fonction du type d'action
                  const getEventStyle = () => {
                    const action = item.action.toLowerCase();
                    
                    if (action.includes('création') || action.includes('creat')) {
                      return {
                        bgColor: 'bg-green-50',
                        borderColor: 'border-green-200',
                        iconBgColor: 'bg-green-100',
                        iconColor: 'text-green-600',
                        icon: <Plus className="w-4 h-4" />
                      };
                    }
                    
                    if (action.includes('modif') || action.includes('update') || action.includes('edit')) {
                      return {
                        bgColor: 'bg-blue-50',
                        borderColor: 'border-blue-200',
                        iconBgColor: 'bg-blue-100',
                        iconColor: 'text-blue-600',
                        icon: <Edit className="w-4 h-4" />
                      };
                    }
                    
                    if (action.includes('activ') || action.includes('valid')) {
                      return {
                        bgColor: 'bg-purple-50',
                        borderColor: 'border-purple-200',
                        iconBgColor: 'bg-purple-100',
                        iconColor: 'text-purple-600',
                        icon: <CheckCircle className="w-4 h-4" />
                      };
                    }
                    
                    // Par défaut
                    return {
                      bgColor: 'bg-gray-50',
                      borderColor: 'border-gray-200',
                      iconBgColor: 'bg-gray-100',
                      iconColor: 'text-gray-600',
                      icon: <Clock className="w-4 h-4" />
                    };
                  };
                  
                  const style = getEventStyle();
                  
                  return (
                    <div key={index} className="relative mb-8 last:mb-0">
                      {/* Indicateur de timeline */}
                      <div className="absolute -left-[41px] w-8 h-8 rounded-full border-2 border-primary-500 bg-white flex items-center justify-center shadow-sm">
                        <div className={`w-6 h-6 rounded-full ${style.iconBgColor} ${style.iconColor} flex items-center justify-center`}>
                          {style.icon}
                        </div>
                      </div>
                      
                      {/* Contenu de l'événement */}
                      <div className={`${style.bgColor} rounded-lg p-5 shadow-sm border ${style.borderColor} ml-3`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                          <h4 className="font-medium text-gray-800 mb-1 sm:mb-0">{item.action}</h4>
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white bg-opacity-60 shadow-sm">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary-600" />
                            <span>{new Date(item.date).toLocaleDateString('fr-FR')} à {new Date(item.date).toLocaleTimeString('fr-FR')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="w-4 h-4 mr-1.5 text-gray-500" />
                          <span>Effectué par {item.utilisateur}</span>
                        </div>
                        
                        {item.details && (
                          <div className="mt-2 p-3 bg-white bg-opacity-60 rounded-md text-sm text-gray-600">
                            {item.details}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Chargement des détails du GIE...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-4">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </button>
      </div>
    );
  }
  
  if (!gie) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-xl mb-4">
          <p>Aucune information trouvée pour ce GIE.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* En-tête avec informations du GIE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all overflow-hidden mb-8">
        <div className="relative">
          {/* Bannière décorative */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-primary-500 to-primary-600"></div>
          
          <div className="relative p-6 pt-20">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center bg-white text-gray-700 hover:text-primary-600 px-4 py-2 rounded-xl shadow-sm border border-gray-200 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="font-medium">Retour au tableau de bord</span>
              </button>
              
              <div className="flex items-center space-x-3">
                {gie.statutAdhesion === 'validee' && gie.statutEnregistrement === 'valide' ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-600 shadow-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    GIE actif
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-amber-100 text-amber-600 shadow-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    En attente d'activation
                  </span>
                )}
                
                {(gie.statutAdhesion !== 'validee' || gie.statutEnregistrement !== 'valide') && (
                  <button 
                    onClick={activerAdhesion}
                    className="flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-sm transition-all"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activer l'adhésion
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex items-center justify-center bg-primary-50 text-primary-600 rounded-xl h-16 w-16 mr-4 shadow-sm">
                  <Building className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">{gie.nomGIE}</h1>
                  <div className="flex items-center text-primary-600 text-sm font-medium">
                    <Clipboard className="w-4 h-4 mr-1.5" />
                    <span>{gie.identifiantGIE}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                  <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Localisation</p>
                    <p className="text-sm font-medium">{gie.region}, {gie.departement}</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                  <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Date de création</p>
                    <p className="text-sm font-medium">{new Date(gie.dateCreation).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        {/* Tabs de navigation */}
        <div className="px-6 pt-4 border-t border-gray-100 bg-primary-50">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            <button 
              onClick={() => setActiveTab('informations')} 
              className={`px-4 py-2 rounded-t-lg transition-all whitespace-nowrap flex items-center ${
                activeTab === 'informations' 
                  ? 'bg-white text-primary-600 font-medium shadow-sm border-t border-l border-r border-gray-200' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              <FileText className={`w-4 h-4 mr-2 ${activeTab === 'informations' ? 'text-primary-600' : 'text-gray-500'}`} />
              Informations générales
            </button>
            <button 
              onClick={() => setActiveTab('membres')} 
              className={`px-4 py-2 rounded-t-lg transition-all whitespace-nowrap flex items-center ${
                activeTab === 'membres' 
                  ? 'bg-white text-primary-600 font-medium shadow-sm border-t border-l border-r border-gray-200' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              <Users className={`w-4 h-4 mr-2 ${activeTab === 'membres' ? 'text-primary-600' : 'text-gray-500'}`} />
              Membres
            </button>
            <button 
              onClick={() => setActiveTab('documents')} 
              className={`px-4 py-2 rounded-t-lg transition-all whitespace-nowrap flex items-center ${
                activeTab === 'documents' 
                  ? 'bg-white text-primary-600 font-medium shadow-sm border-t border-l border-r border-gray-200' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              <FileText className={`w-4 h-4 mr-2 ${activeTab === 'documents' ? 'text-primary-600' : 'text-gray-500'}`} />
              Documents
            </button>
            <button 
              onClick={() => setActiveTab('historique')} 
              className={`px-4 py-2 rounded-t-lg transition-all whitespace-nowrap flex items-center ${
                activeTab === 'historique' 
                  ? 'bg-white text-primary-600 font-medium shadow-sm border-t border-l border-r border-gray-200' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              <Clock className={`w-4 h-4 mr-2 ${activeTab === 'historique' ? 'text-primary-600' : 'text-gray-500'}`} />
              Historique
            </button>
          </div>
        </div>
      </div>
      </div>
      
      {/* Contenu principal */}
      {renderTabContent()}
    </div>
  );
};

export default GIEDetails;
