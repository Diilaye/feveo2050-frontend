import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  X,
  Plus,
  Trash2,
  Save,
  Shield,
  Edit,
  
  UserPlus,
  FileText
} from 'lucide-react';

      const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3051/api';

// Interfaces pour les plans d'investissement et d'épargne
interface BasePlan {
  id: number;
  name: string;
  description: string;
  expectedReturn: string;
  isActive: boolean;
  type: string;
}

interface InvestmentPlan extends BasePlan {
  amount: number;
  frequency: string;
  duration: string;
  totalInvested: number;
  remainingDays: number;
  daysInvested: number;
}

interface SavingsPlan extends BasePlan {
  minAmount?: number;
  amount?: number;
  frequency?: string;
  duration?: string;
  totalSaved: number;
}

type Plan = InvestmentPlan | SavingsPlan;


const WalletDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const [walletData, setWalletData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wallet');
  
  // État pour les transactions
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  
  // État pour le calendrier d'investissement
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    // Par défaut, commencer à avril 2025
    return new Date('2025-04-01');
  });
  
  // État pour le type d'investissement actif (classique ou épargne)
  const [investmentType, setInvestmentType] = useState('classique');
  
  // État pour le type d'activité de revenu sélectionné
  const [revenueActivityType, setRevenueActivityType] = useState('commerce');
  
  // Données pour les activités de revenus
  const revenueActivityData = {
    commerce: [
      { id: 1, name: 'Commerce Grande Distribution', revenue: 1250000, growth: 8.5, transactions: 45, lastMonthRevenue: 1150000 },
      { id: 2, name: 'Commerce de Détail', revenue: 950000, growth: 5.2, transactions: 78, lastMonthRevenue: 903000 },
      { id: 3, name: 'Commerce en Ligne', revenue: 820000, growth: 12.7, transactions: 62, lastMonthRevenue: 728000 }
    ],
    agriculture: [
      { id: 1, name: 'Production Céréalière', revenue: 780000, growth: 6.3, transactions: 28, lastMonthRevenue: 734000 },
      { id: 2, name: 'Maraîchage', revenue: 620000, growth: 9.8, transactions: 36, lastMonthRevenue: 564000 },
      { id: 3, name: 'Élevage', revenue: 890000, growth: 7.5, transactions: 19, lastMonthRevenue: 827000 }
    ],
    industrie: [
      { id: 1, name: 'Transformation Alimentaire', revenue: 950000, growth: 5.7, transactions: 32, lastMonthRevenue: 898000 },
      { id: 2, name: 'Artisanat Industriel', revenue: 720000, growth: 4.2, transactions: 24, lastMonthRevenue: 691000 },
      { id: 3, name: 'Fabrication Textile', revenue: 680000, growth: 8.9, transactions: 28, lastMonthRevenue: 624000 }
    ]
  };
  
  // États pour la gestion des membres
  const [membres, setMembres] = useState<any[]>([]);
  const [membresLoading, setMembresLoading] = useState(false);
  const [membresStats, setMembresStats] = useState<any>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  // États pour la gestion des documents
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documents, setDocuments] = useState<any>({
    statuts: false,
    reglementInterieur: false,
    procesVerbal: false,
    demandeAdhesion: false
  });
  const [memberForm, setMemberForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    fonction: 'Membre',
    genre: 'femme',
    cin: '',
    dateNaissance: '',
    profession: '',
    adresse: '',
    statut: 'Actif'
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
              presidente: 'Aïssatou Diallo',
              daysInvestedSuccess: [1, 2, 3, 5, 8, 10, 12, 15, 18, 20] // Jours d'investissement réussis
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

  // Charger les transactions lorsque le wallet est chargé
  useEffect(() => {
    if (walletData && !isLoading) {
      loadTransactions();
    }
  }, [walletData, isLoading]);

  // Fonction pour charger les données des membres
  const loadMembres = async () => {
    if (!walletData?.gieInfo?.code) return;
    
    setMembresLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wallet/members/${walletData.gieInfo.code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Données des membres reçues:', data);
        if (data && data.data && data.data.membres) {
          // On récupère les membres du GIE
          setMembres(data.data.membres);
          console.log('Membres chargés:', data.data.membres);
        } else {
          console.error('Format de données inattendu:', data);
          setMembres([]);
        }
      } else {
        console.error('Erreur lors de la récupération des membres');
        setMembres([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error);
      // Si erreur, on utilise des données fictives pour le développement
      setMembres([
        {
          nom: 'GNING',
          prenom: 'FATOU',
          fonction: 'Présidente',
          cin: '22670197500225',
          telephone: '765301149',
          genre: 'femme',
          _id: { $oid: 'president123' }
        },
        {
          nom: 'THIAO',
          prenom: 'THIORO',
          fonction: 'Secrétaire',
          cin: '2597198400032',
          telephone: '773941632',
          genre: 'femme',
          _id: { $oid: 'secretaire456' }
        },
        {
          nom: 'DIOUF',
          prenom: 'FATOU',
          fonction: 'Trésorière',
          cin: '2670199100067',
          telephone: '766468286',
          genre: 'femme',
          _id: { $oid: 'tresoriere789' }
        }
      ]);
    } finally {
      setMembresLoading(false);
    }
  };

  // Fonction pour charger les statistiques des membres
  const loadMembresStats = async () => {
    if (!walletData?.gieInfo?.code) return;
    
    try {
      const response = await fetch(`${BASE_URL}/wallet/members/${walletData.gieInfo.code}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          setMembresStats(data.data);
        } else {
          console.error('Format de données inattendu pour les statistiques:', data);
        }
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
      // Préparation des données du membre selon le format attendu par l'API
      const memberData = {
        nom: memberForm.nom,
        prenom: memberForm.prenom,
        fonction: memberForm.fonction,
        cin: memberForm.cin,
        telephone: memberForm.telephone,
        genre: memberForm.genre
      };

      const response = await fetch(`${BASE_URL}/wallet/members/${walletData.gieInfo.code}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Membre ajouté avec succès !');
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
      // Préparation des données du membre selon le format attendu par l'API
      const memberData = {
        nom: memberForm.nom,
        prenom: memberForm.prenom,
        fonction: memberForm.fonction,
        cin: memberForm.cin,
        telephone: memberForm.telephone,
        genre: memberForm.genre
      };
      
      const memberId = selectedMember._id?.$oid || selectedMember._id;
      
      const response = await fetch(`${BASE_URL}/wallet/members/${walletData.gieInfo.code}/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Membre modifié avec succès !');
        setShowEditMemberModal(false);
        resetMemberForm();
        setSelectedMember(null);
        await loadMembres();
        await loadMembresStats();
      } else {
        toast.error(`Erreur: ${data.message || 'Échec de la modification du membre'}`);
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
      // Récupération de l'ID du membre au bon format
      const memberId = membre._id?.$oid || membre._id;
      
      const response = await fetch(`${BASE_URL}/wallet/members/${walletData.gieInfo.code}/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Membre supprimé avec succès !');
        setShowEditMemberModal(false); // Fermer le modal d'édition si ouvert
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

  // Fonction pour gérer les changements dans le formulaire
  const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMemberForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Fonction pour réinitialiser le formulaire
  const resetMemberForm = () => {
    setMemberForm({
      nom: '',
      prenom: '',
      telephone: '',
      fonction: 'Membre',
      genre: 'femme',
      cin: '',
      dateNaissance: '',
      profession: '',
      adresse: '',
      statut: 'Actif'
    });
  };

  // Fonction pour ouvrir le modal d'édition
  const openEditModal = (membre: any) => {
    console.log('Édition du membre:', membre);
    setSelectedMember(membre);
    setMemberForm({
      nom: membre.nom || '',
      prenom: membre.prenom || '',
      telephone: membre.telephone || '',
      fonction: membre.fonction || 'Membre',
      genre: membre.genre || 'femme',
      cin: membre.cin || '',
      dateNaissance: membre.dateNaissance ? membre.dateNaissance.split('T')[0] : '',
      profession: membre.profession || '',
      adresse: membre.adresse || '',
      statut: membre.statut || 'Actif'
    });
    setShowEditMemberModal(true);
  };

  // Fonction pour charger les informations sur les documents du GIE
  const loadDocuments = async () => {
    if (!walletData?.gieInfo?.code) return;
    
    setDocumentsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wallet/documents/${walletData.gieInfo.code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data && data.data.documentsGeneres) {
          setDocuments(data.data.documentsGeneres);
        } else {
          console.error('Format de données inattendu pour les documents:', data);
        }
      } else {
        console.error('Erreur lors de la récupération des documents');
        // Utiliser des valeurs par défaut si l'API n'est pas encore implémentée
        setDocuments({
          statuts: Math.random() > 0.5,
          reglementInterieur: Math.random() > 0.5,
          procesVerbal: Math.random() > 0.5,
          demandeAdhesion: Math.random() > 0.5
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      // Utiliser des valeurs par défaut en cas d'erreur
      setDocuments({
        statuts: true,
        reglementInterieur: true,
        procesVerbal: true,
        demandeAdhesion: true
      });
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Fonction pour télécharger un document
  const handleDocumentDownload = async (documentType: string) => {
    if (!walletData?.gieInfo?.code) return;
    
    try {
      const response = await fetch(`${BASE_URL}/wallet/documents/${walletData.gieInfo.code}/${documentType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Convertir la réponse en blob
        const blob = await response.blob();
        
        // Créer une URL pour le blob
        const url = window.URL.createObjectURL(blob);
        
        // Créer un élément <a> temporaire pour déclencher le téléchargement
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Déterminer le nom du fichier selon le type de document
        let fileName = '';
        switch (documentType) {
          case 'statuts':
            fileName = `Statuts_GIE_${walletData.gieInfo.code}.pdf`;
            break;
          case 'reglementInterieur':
            fileName = `Reglement_Interieur_GIE_${walletData.gieInfo.code}.pdf`;
            break;
          case 'procesVerbal':
            fileName = `Proces_Verbal_GIE_${walletData.gieInfo.code}.pdf`;
            break;
          case 'demandeAdhesion':
            fileName = `Demande_Adhesion_GIE_${walletData.gieInfo.code}.pdf`;
            break;
          default:
            fileName = `Document_GIE_${walletData.gieInfo.code}.pdf`;
        }
        
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success(`Téléchargement du document "${fileName}" réussi !`);
      } else {
        console.error(`Erreur lors du téléchargement du document ${documentType}`);
        toast.error('Erreur lors du téléchargement du document');
      }
    } catch (error) {
      console.error(`Erreur lors du téléchargement du document ${documentType}:`, error);
      toast.error('Erreur lors du téléchargement du document');
    }
  };

  // Charger les données quand on change d'onglet
  useEffect(() => {
    if (activeTab === 'membres' && walletData?.gieInfo?.code) {
      loadMembres();
      loadMembresStats();
    } else if (activeTab === 'documents' && walletData?.gieInfo?.code) {
      loadDocuments();
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

  // Charger les transactions du GIE
  const loadTransactions = async () => {
    if (!walletData?.gieInfo?.code) {
      console.warn('Impossible de charger les transactions: Code GIE manquant');
      return;
    }
    
    console.log('Chargement des transactions pour le GIE:', walletData.gieInfo.code);
    setTransactionsLoading(true);
    try {
      const sessionToken = localStorage.getItem('walletSession');
      
      const url = `${BASE_URL}/transactions?gieCode=${walletData.gieInfo.code}`;
      console.log('URL de l\'API des transactions:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse API non valide:', response.status, errorText);
        throw new Error(`Erreur lors de la récupération des transactions: ${response.status}`);
      }
      
      const data = await response.json();

      console.log('Données des transactions reçues:', data);
      console.log('Nombre de transactions:', data.data?.length || 0);

      if (data.status === 'OK' && data.data) {
        // Mapper les données pour correspondre à notre format d'affichage
        const formattedTransactions = data.data.map((transaction: any) => {
          console.log('Traitement transaction:', transaction);
          
          // Gestion sécurisée de la date
          let formattedDate;
          try {
            // Vérifier si createdAt existe et est valide
            if (transaction.createdAt) {
              const dateObj = new Date(transaction.createdAt);
              // Vérifier si la date est valide
              if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toISOString().split('T')[0];
              } else {
                formattedDate = new Date().toISOString().split('T')[0]; // Date actuelle par défaut
                console.warn('Date invalide pour transaction:', transaction._id);
              }
            } else {
              formattedDate = new Date().toISOString().split('T')[0]; // Date actuelle par défaut
              console.warn('Date manquante pour transaction:', transaction._id);
            }
          } catch (error) {
            console.error('Erreur lors du traitement de la date:', error);
            formattedDate = new Date().toISOString().split('T')[0]; // Date actuelle par défaut
          }
          
          return {
            id: transaction._id,
            type: transaction.operationType === 'ADHESION' ? 'adhesion' : 
                  transaction.operationType === 'INVESTISSEMENT' ? 'investment' : 'other',
            amount: transaction.amount || 0,
            date: formattedDate,
            description: transaction.operationType === 'ADHESION' 
              ? 'Frais d\'adhésion FEVEO 2050' 
              : transaction.operationType === 'INVESTISSEMENT'
                ? `Investissement ${transaction.daysInvested || ''} ${transaction.daysInvested === 1 ? 'jour' : 'jours'}`
                : transaction.description || 'Transaction',
            status: transaction.status,
            method: transaction.method
          };
        });
        
        console.log('Transactions formatées:', formattedTransactions);
        setTransactions(formattedTransactions);
      } else {
        console.warn('Format de données inattendu:', data);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
      // En cas d'erreur, utiliser des données de test
      setTransactions([
        { type: 'investment', amount: 6000, date: '2025-07-26', description: 'Investissement jour 12', status: 'SUCCESS' },
        { type: 'return', amount: 420, date: '2025-07-25', description: 'Retour investissement jour 11', status: 'SUCCESS' },
        { type: 'investment', amount: 6000, date: '2025-07-25', description: 'Investissement jour 11', status: 'SUCCESS' }
      ]);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour effectuer une transaction d'investissement ou d'épargne
  const handleInvestment = async (planId: number) => {
    if (!walletData || !walletData.gieInfo || !walletData.gieInfo.code) {
      console.warn('Impossible d\'effectuer l\'opération: Code GIE manquant');
      return;
    }

    // Rechercher le plan dans les deux catégories
    let investmentPlan = investmentPlans.find(p => p.id === planId);
    let savingsPlan = savingsPlans.find(p => p.id === planId);
    
    // Déterminer le type d'opération (investissement ou épargne)
    const isInvestment = !!investmentPlan;
    const operationType = isInvestment ? 'INVESTISSEMENT' : 'EPARGNE';
    
    // Vérifier qu'un plan a été trouvé
    if (!investmentPlan && !savingsPlan) {
      console.error('Plan non trouvé:', planId);
      return;
    }
    
    // Déterminer le montant selon le type de plan
    let amount: number;
    let daysInvested: number | undefined;
    
    if (isInvestment && investmentPlan) {
      amount = investmentPlan.amount;
      daysInvested = investmentPlan.daysInvested;
    } else if (savingsPlan) {
      // Pour l'épargne libre, demander le montant
      if (savingsPlan.id === 101 && savingsPlan.minAmount) {
        const inputAmount = prompt(`Montant à épargner (minimum ${formatCurrency(savingsPlan.minAmount)}):`, savingsPlan.minAmount.toString());
        if (!inputAmount) return; // Annulé
        
        amount = parseInt(inputAmount);
        if (isNaN(amount) || (savingsPlan.minAmount && amount < savingsPlan.minAmount)) {
          alert(`Le montant doit être d'au moins ${formatCurrency(savingsPlan.minAmount)}`);
          return;
        }
      } else {
        // Pour les autres types d'épargne, utiliser le montant défini ou minimum
        amount = savingsPlan.amount || (savingsPlan.minAmount || 5000);
      }
    } else {
      // Cas improbable mais pour satisfaire TypeScript
      return;
    }
    
    // Message de confirmation approprié selon le type d'opération
    let confirmMessage = '';
    if (isInvestment && investmentPlan) {
      confirmMessage = `Êtes-vous sûr de vouloir investir ${formatCurrency(amount)} pour ${investmentPlan.daysInvested} jours?`;
    } else {
      confirmMessage = `Êtes-vous sûr de vouloir épargner ${formatCurrency(amount)}?`;
    }
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Afficher un message de chargement approprié
      const actionVerb = operationType === 'INVESTISSEMENT' ? 'investissement' : 'épargne';
      toast?.info?.(`Traitement de votre ${actionVerb} de ${formatCurrency(amount)}...`);

      // Calculer le montant final selon le type d'opération
      const finalAmount = operationType === 'INVESTISSEMENT' && daysInvested
        ? (6000 * daysInvested) + (6000 * daysInvested * 0.01)
        : amount;
        
      const response = await fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          gieCode: walletData.gieInfo.code,
          amount: finalAmount,
          method: 'WAVE',
          daysInvested: daysInvested,
          operationType: operationType
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast?.success?.(`${operationType === 'INVESTISSEMENT' ? 'Investissement' : 'Épargne'} de ${formatCurrency(amount)} effectué avec succès!`);
        
        // Récupérer les informations de la transaction créée
        const transaction = data.data;
        const paymentUrl = transaction.urlWave;
        const transactionId = transaction.reference;

        if (paymentUrl) {
          // Succès avec l'API de transactions
          const message = `🎉 Transaction ${operationType === 'INVESTISSEMENT' ? 'd\'investissement' : 'd\'épargne'} créée avec succès !\n\n` +
                          `Détails :\n` +
                          `• Code GIE: ${walletData.gieInfo.code}\n` +
                          `• Montant: ${formatCurrency(amount)}\n` +
                          (daysInvested ? `• Période: ${daysInvested} jours\n` : '') +
                          `• Transaction ID: ${transactionId}\n\n` +
                          `Redirection vers Wave...`;

          alert(message);
          window.open(paymentUrl, '_blank');
        }
        
        
      } else {
        toast?.error?.(`Erreur: ${data.message || 'Une erreur est survenue'}`);
        console.error('Erreur lors de l\'investissement:', data);
      }
    } catch (error) {
      console.error('Erreur lors de la requête d\'investissement:', error);
      alert('Une erreur est survenue lors de la transaction');
    }
  };

  const progressPercentage = (walletData.cycleInfo.currentDay / walletData.cycleInfo.totalDays) * 100;

  // Données pour la page des revenus d'activités
  const revenueActivities = {
    commerce: [
      {
        id: 'c1',
        name: 'Supermarché FEVEO',
        description: 'Grande surface de distribution alimentaire et produits divers',
        revenue: 12500000,
        expenses: 9800000,
        profit: 2700000,
        growthRate: 7.2,
        employees: 45,
        locations: 2,
        image: '🛒',
        color: 'blue'
      },
      {
        id: 'c2',
        name: 'Boutique Artisanale',
        description: 'Vente de produits artisanaux locaux',
        revenue: 3200000,
        expenses: 1900000,
        profit: 1300000,
        growthRate: 12.5,
        employees: 12,
        locations: 1,
        image: '🧶',
        color: 'purple'
      },
      {
        id: 'c3',
        name: 'Market Express',
        description: 'Réseau de mini-markets de proximité',
        revenue: 8750000,
        expenses: 7200000,
        profit: 1550000,
        growthRate: 9.8,
        employees: 28,
        locations: 6,
        image: '🏪',
        color: 'green'
      }
    ],
    agriculture: [
      {
        id: 'a1',
        name: 'Ferme Collective',
        description: 'Production agricole diversifiée (riz, maïs, légumes)',
        revenue: 7800000,
        expenses: 4900000,
        profit: 2900000,
        growthRate: 5.6,
        hectares: 124,
        employees: 63,
        image: '🌾',
        color: 'green'
      },
      {
        id: 'a2',
        name: 'Élevage Durable',
        description: 'Élevage de volaille et petit bétail',
        revenue: 6200000,
        expenses: 4300000,
        profit: 1900000,
        growthRate: 8.2,
        units: 1200,
        employees: 22,
        image: '🐓',
        color: 'brown'
      },
      {
        id: 'a3',
        name: 'Vergers FEVEO',
        description: 'Culture d\'arbres fruitiers et transformation',
        revenue: 5100000,
        expenses: 3200000,
        profit: 1900000,
        growthRate: 11.3,
        hectares: 38,
        employees: 17,
        image: '🍊',
        color: 'orange'
      }
    ],
    transformation: [
      {
        id: 't1',
        name: 'Atelier Textile',
        description: 'Confection de vêtements et accessoires',
        revenue: 4900000,
        expenses: 3100000,
        profit: 1800000,
        growthRate: 14.7,
        employees: 32,
        production: '15000 unités/mois',
        image: '👕',
        color: 'indigo'
      },
      {
        id: 't2',
        name: 'Transformation Alimentaire',
        description: 'Production de conserves et produits transformés',
        revenue: 6700000,
        expenses: 4900000,
        profit: 1800000,
        growthRate: 9.5,
        employees: 26,
        production: '22 tonnes/mois',
        image: '🥫',
        color: 'red'
      },
      {
        id: 't3',
        name: 'Matériaux Écologiques',
        description: 'Fabrication de matériaux de construction écologiques',
        revenue: 8200000,
        expenses: 6500000,
        profit: 1700000,
        growthRate: 16.8,
        employees: 19,
        production: '450 tonnes/trimestre',
        image: '🧱',
        color: 'teal'
      }
    ]
  };

  // Fonctions pour naviguer entre les mois du calendrier
  const goToPreviousMonth = () => {
    const newDate = new Date(displayedMonth);
    newDate.setMonth(displayedMonth.getMonth() - 1);
    
    // Ne pas aller avant avril 2025
    if (newDate >= new Date('2025-04-01')) {
      setDisplayedMonth(newDate);
    }
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(displayedMonth);
    newDate.setMonth(displayedMonth.getMonth() + 1);
    
    // Limiter à 5 ans après avril 2025 (mars 2030)
    const endDate = new Date('2030-03-31');
    if (newDate <= endDate) {
      setDisplayedMonth(newDate);
    }
  };
  
  const goToCurrentMonth = () => {
    const now = new Date();
    // Si on est avant avril 2025, afficher avril 2025
    if (now < new Date('2025-04-01')) {
      setDisplayedMonth(new Date('2025-04-01'));
    } else {
      // Si on est après mars 2030, afficher mars 2030
      if (now > new Date('2030-03-31')) {
        setDisplayedMonth(new Date('2030-03-01'));
      } else {
        setDisplayedMonth(now);
      }
    }
  };

  // Calculer les dates du cycle d'investissement
  const getInvestmentDates = () => {
    const startDate = new Date('2025-04-01'); // Date de début du cycle fixée au 1er avril
    const totalDays = 1826; // Nombre total de jours d'investissement (5 ans environ)
    const dates = [];
    
    // Déterminer le jour actuel dans le cycle en calculant la différence avec la date de début
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = Math.max(1, Math.min(diffDays + 1, totalDays)); // Entre 1 et totalDays
    
    // Récupérer les jours investis avec succès du GIE (si disponible)
    const daysInvestedSuccess = walletData?.gieInfo?.daysInvestedSuccess || [];

    console.log('Jours investis avec succès:', walletData?.gieInfo
      
    );
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayNumber = i + 1;
      
      // Vérifier si ce jour est dans la liste des jours investis avec succès
      const isSuccessfulInvestment = daysInvestedSuccess.includes(dayNumber);
      
      dates.push({
        date: date,
        dayNumber: dayNumber,
        isInvested: dayNumber <= currentDay, // Jour déjà investi
        isToday: dayNumber === currentDay,   // Jour courant dans le cycle
        isSuccessfulInvestment: isSuccessfulInvestment // Jour investi avec succès
      });
    }
    
    // Mettre à jour l'information du cycle dans walletData
    if (walletData && walletData.cycleInfo) {
      walletData.cycleInfo.totalDays = totalDays;
      walletData.cycleInfo.currentDay = currentDay;
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
          investmentDays: [],
          successfulDays: [] // Jours investis avec succès
        };
      }
      
      // Ajouter le jour à investmentDays
      grouped[monthKey].investmentDays.push(date.getDate());
      
      // Si c'est un jour investi avec succès, l'ajouter à successfulDays
      if (dateObj.isSuccessfulInvestment) {
        grouped[monthKey].successfulDays.push(date.getDate());
      }
    });
    
    return grouped;
  };  
  const monthlyData = groupByMonth(investmentDates);

  // Données pour la page investissements
  const investmentPlans = [
    {
      id: 1,
      name: 'Plan Quotidien',
      description: 'Investissement quotidien de 6 000 FCFA',
      amount: 6000,
      frequency: 'Quotidien',
      duration: '60 jours',
      expectedReturn: '7% par jour',
      isActive: true,
      totalInvested: walletData.cycleInfo.currentDay * 6000,
      remainingDays: walletData.cycleInfo.totalDays - walletData.cycleInfo.currentDay,
      daysInvested: 1, // Nombre de jours investis pour ce plan
      type: 'classique'
    },
    {
      id: 2,
      name: 'Plan 10 Jours',
      description: 'Investissement de 60 000 FCFA tous les 10 jours',
      amount: 60000,
      frequency: '10 Jours',
      duration: '10 jours',
      expectedReturn: '7.5% par période',
      isActive: false,
      totalInvested: 0,
      remainingDays: 0,
      daysInvested: 10, // Nombre de jours investis pour ce plan
      type: 'classique'
    },
    {
      id: 3,
      name: 'Plan 15 Jours',
      description: 'Investissement de 90 000 FCFA tous les 15 jours',
      amount: 90000,
      frequency: '15 Jours',
      duration: '15 jours',
      expectedReturn: '8% par période',
      isActive: false,
      totalInvested: 0,
      remainingDays: 0,
      daysInvested: 15, // Nombre de jours investis pour ce plan
      type: 'classique'
    },
    {
      id: 4,
      name: 'Plan 30 Jours',
      description: 'Investissement de 180 000 FCFA tous les 30 jours',
      amount: 180000,
      frequency: '30 Jours',
      duration: '30 jours',
      expectedReturn: '9% par période',
      isActive: false,
      totalInvested: 0,
      remainingDays: 0,
      daysInvested: 30, // Nombre de jours investis pour ce plan
      type: 'classique'
    }
  ];

  // Plans d'épargne volontaire GIE
  const savingsPlans = [
    {
      id: 101,
      name: 'Épargne Libre',
      description: 'Déposez le montant de votre choix quand vous le souhaitez',
      minAmount: 5000,
      expectedReturn: '3% annuel',
      isActive: true,
      totalSaved: 150000,
      type: 'epargne'
    },
    {
      id: 102,
      name: 'Épargne Mensuelle',
      description: 'Plan d\'épargne avec versement mensuel fixe',
      amount: 25000,
      frequency: 'Mensuel',
      duration: 'Illimité',
      expectedReturn: '4% annuel',
      isActive: false,
      totalSaved: 0,
      type: 'epargne'
    },
    {
      id: 103,
      name: 'Épargne Projet',
      description: 'Épargne dédiée à un projet spécifique',
      minAmount: 50000,
      duration: '6-24 mois',
      expectedReturn: '5% à terme',
      isActive: false,
      totalSaved: 0,
      type: 'epargne'
    },
    {
      id: 104,
      name: 'Fonds Social GIE',
      description: 'Contribution au fonds social du GIE',
      minAmount: 2000,
      frequency: 'Mensuel',
      expectedReturn: 'Solidarité',
      isActive: false,
      totalSaved: 0,
      type: 'epargne'
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
                
                {/* Onglets pour choisir le type d'investissement */}
                <div className="flex mt-4 bg-white bg-opacity-20 rounded-lg p-1 max-w-md">
                  <button 
                    onClick={() => setInvestmentType('classique')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      investmentType === 'classique' 
                        ? 'bg-white text-green-700 shadow-sm' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Investissements
                  </button>
                  <button 
                    onClick={() => setInvestmentType('epargne')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      investmentType === 'epargne' 
                        ? 'bg-white text-blue-700 shadow-sm' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Épargne GIE
                  </button>
                </div>
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
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.balance.returns)}</p> <p className="text-xs text-green-600 mt-1">+14% ROI</p>
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

            {/* Plans d'investissement ou d'épargne */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {investmentType === 'classique' ? 'Plans d\'Investissement Disponibles' : 'Options d\'Épargne Volontaire GIE'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {investmentType === 'classique' 
                  ? investmentPlans.map((plan) => (
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
                      
                      {/* Informations supplémentaires */}
                      <div className={`grid grid-cols-2 gap-2 text-center text-xs ${
                        plan.isActive ? 'text-white' : 'text-gray-600'
                      }`}>
                        <div className="p-2">
                          <p className="font-semibold mb-1">Jours investis</p>
                          <p>{plan.daysInvested} {plan.daysInvested > 1 ? 'jours' : 'jour'}</p>
                        </div>
                        
                      </div>
                    </div>

                    {plan.isActive ? (
                      <div className="space-y-3">
                        
                        <button 
                          className="w-full bg-white text-green-600 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all font-medium shadow-md"
                          onClick={() => handleInvestment(plan.id)}
                        >
                          Investir Maintenant
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md flex items-center justify-center"
                        onClick={() => handleInvestment(plan.id)}
                      >
                        Investir {formatCurrency(plan.amount)}
                      </button>
                    )}
                  </div>
                ))
                : savingsPlans.map((plan) => (
                  <div key={plan.id} className={`rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl ${
                    plan.isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'bg-white border-2 border-gray-200 hover:border-blue-400'
                  }`}>
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        plan.isActive 
                          ? 'bg-white bg-opacity-20' 
                          : 'bg-blue-100'
                      }`}>
                        <Wallet className={`w-8 h-8 ${
                          plan.isActive ? 'text-white' : 'text-blue-600'
                        }`} />
                      </div>
                      <h4 className={`text-2xl font-bold mb-2 ${
                        plan.isActive ? 'text-white' : 'text-gray-900'
                      }`}>
                        {plan.name}
                      </h4>
                      <p className={`text-sm ${
                        plan.isActive ? 'text-blue-100' : 'text-gray-600'
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
                          {plan.amount ? formatCurrency(plan.amount) : plan.minAmount ? `Min. ${formatCurrency(plan.minAmount)}` : 'Montant libre'}
                        </p>
                        <p className={`text-sm ${
                          plan.isActive ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {plan.frequency ? `par ${plan.frequency.toLowerCase()}` : 'à votre rythme'}
                        </p>
                      </div>
                      
                      {/* Informations supplémentaires */}
                      <div className={`grid grid-cols-2 gap-2 text-center text-xs ${
                        plan.isActive ? 'text-white' : 'text-gray-600'
                      }`}>
                        <div className="p-2">
                          <p className="font-semibold mb-1">Rendement</p>
                          <p className={plan.isActive ? 'text-blue-100' : 'text-blue-600'}>
                            {plan.expectedReturn}
                          </p>
                        </div>
                        <div className="p-2">
                          <p className="font-semibold mb-1">Durée</p>
                          <p>{plan.duration || 'Flexible'}</p>
                        </div>
                      </div>
                    </div>

                    {plan.isActive ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center text-white">
                          <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                          <span className="font-medium">Plan Actif</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3 text-center">
                          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <p className="text-sm text-blue-100">Total Épargné</p>
                            <p className="font-bold text-white">{formatCurrency(plan.totalSaved)}</p>
                          </div>
                        </div>
                        <button 
                          className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all font-medium shadow-md"
                          onClick={() => handleInvestment(plan.id)}
                        >
                          Épargner Plus
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md flex items-center justify-center"
                        onClick={() => handleInvestment(plan.id)}
                      >
                        <DollarSign className="w-5 h-5 mr-2" />
                        {plan.id === 101 ? 'Épargner Maintenant' : `Épargner ${plan.amount ? formatCurrency(plan.amount) : ''}`}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            
          </>
        );
        
      case 'revenue':
        return (
          <>
            {/* En-tête de la page revenus d'activité */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Revenus d'Activité</h3>
                <p className="text-orange-100">Suivez les revenus générés par vos différentes activités économiques</p>
                
                {/* Onglets pour choisir le type d'activité */}
                <div className="flex mt-4 bg-white bg-opacity-20 rounded-lg p-1 max-w-md">
                  <button 
                    onClick={() => setRevenueActivityType('commerce')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      revenueActivityType === 'commerce' 
                        ? 'bg-white text-orange-700 shadow-sm' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Commerce
                  </button>
                  <button 
                    onClick={() => setRevenueActivityType('agriculture')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      revenueActivityType === 'agriculture' 
                        ? 'bg-white text-orange-700 shadow-sm' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Agriculture
                  </button>
                  <button 
                    onClick={() => setRevenueActivityType('industrie')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      revenueActivityType === 'industrie' 
                        ? 'bg-white text-orange-700 shadow-sm' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Industrie
                  </button>
                </div>
              </div>
            </div>

            {/* Statistiques globales du secteur sélectionné */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Revenu Total</h4>
                  <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(revenueActivityData[revenueActivityType].reduce((sum, item) => sum + item.revenue, 0))}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{revenueActivityData[revenueActivityType].reduce((sum, item) => sum + (item.revenue - item.lastMonthRevenue), 0) / 
                    revenueActivityData[revenueActivityType].reduce((sum, item) => sum + item.lastMonthRevenue, 0) * 100}% ce mois
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Transactions</h4>
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {revenueActivityData[revenueActivityType].reduce((sum, item) => sum + item.transactions, 0)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Moyenne: {Math.round(revenueActivityData[revenueActivityType].reduce((sum, item) => sum + item.transactions, 0) / 
                  revenueActivityData[revenueActivityType].length)} par activité
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Croissance Moyenne</h4>
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {(revenueActivityData[revenueActivityType].reduce((sum, item) => sum + item.growth, 0) / 
                  revenueActivityData[revenueActivityType].length).toFixed(1)}%
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Performance globale positive
                </p>
              </div>
            </div>

            {/* Liste détaillée des activités */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
                  Détails des Activités - {revenueActivityType === 'commerce' ? 'Commerce & Distribution' : 
                                          revenueActivityType === 'agriculture' ? 'Services Agriculture' : 
                                          'Services Transformation'}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Croissance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {revenueActivityData[revenueActivityType].map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(activity.revenue)}</div>
                          <div className="text-xs text-gray-500">Mois dernier: {formatCurrency(activity.lastMonthRevenue)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.growth >= 10 ? 'bg-green-100 text-green-800' : 
                            activity.growth >= 5 ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.growth}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activity.transactions} transactions
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">Détails</button>
                          <button className="text-green-600 hover:text-green-900">Rapport</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une Nouvelle Activité
                </button>
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
                  <h4 className="text-sm font-medium text-gray-600">Membres Travailleurs</h4>
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
                        Prenom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sexe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CNI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telephone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {membres.map((membre) => (
                      <tr key={membre._id ? membre._id.$oid : membre.cin} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {membre.prenom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {membre.nom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            membre.fonction === 'Présidente' 
                              ? 'bg-purple-100 text-purple-800'
                              : membre.fonction === 'Vice-Président'
                              ? 'bg-blue-100 text-blue-800'
                              : membre.fonction === 'Trésorière'
                              ? 'bg-green-100 text-green-800'
                              : membre.fonction === 'Secrétaire'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {membre.fonction}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {membre.genre === 'femme' ? 'Femme' : 
                           membre.genre === 'jeune' ? 'Jeune' : 
                           membre.genre === 'homme' ? 'Homme' : 'Non spécifié'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {membre.cin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {membre.telephone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => openEditModal(membre)} 
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMember(membre)} 
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Supprimer"
                            >
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
                    {['Présidente', 'Trésorière', 'Secrétaire', 'Membre'].map((role) => {
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
                         
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </>
        );
        
      case 'documents':
        return (
          <>
            {/* En-tête de la page documents */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Documents Officiels du GIE</h3>
                <p className="text-purple-100">Consultez et téléchargez les documents importants de votre GIE</p>
              </div>
            </div>

            {/* Liste des documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Statuts du GIE */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Statuts du GIE</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Document officiel définissant la structure, l'organisation et le fonctionnement du GIE.</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${documents.statuts ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {documents.statuts ? 'Disponible' : 'En attente'}
                  </span>
                  <button 
                    onClick={() => handleDocumentDownload('statuts')}
                    disabled={documentsLoading || !documents.statuts}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      documentsLoading || !documents.statuts 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Télécharger
                  </button>
                </div>
              </div>

              {/* Règlement Intérieur */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Règlement Intérieur</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Règles internes, droits et obligations des membres du GIE.</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${documents.reglementInterieur ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {documents.reglementInterieur ? 'Disponible' : 'En attente'}
                  </span>
                  <button 
                    onClick={() => handleDocumentDownload('reglementInterieur')}
                    disabled={documentsLoading || !documents.reglementInterieur}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      documentsLoading || !documents.reglementInterieur 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Télécharger
                  </button>
                </div>
              </div>

              {/* Procès Verbal */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Procès Verbal</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Document attestant des décisions prises lors de l'assemblée constitutive.</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${documents.procesVerbal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {documents.procesVerbal ? 'Disponible' : 'En attente'}
                  </span>
                  <button 
                    onClick={() => handleDocumentDownload('procesVerbal')}
                    disabled={documentsLoading || !documents.procesVerbal}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      documentsLoading || !documents.procesVerbal 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Télécharger
                  </button>
                </div>
              </div>

              {/* Demande d'Adhésion */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <UserPlus className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Demande d'Adhésion</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Formulaire officiel pour l'adhésion au programme FEVEO 2050.</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${documents.demandeAdhesion ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {documents.demandeAdhesion ? 'Disponible' : 'En attente'}
                  </span>
                  <button 
                    onClick={() => handleDocumentDownload('demandeAdhesion')}
                    disabled={documentsLoading || !documents.demandeAdhesion}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      documentsLoading || !documents.demandeAdhesion 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    Télécharger
                  </button>
                </div>
              </div>
            </div>

            {/* Section information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Information sur les documents</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Ces documents sont générés automatiquement lors de l'inscription de votre GIE au programme FEVEO 2050.</p>
                    <p className="mt-1">Pour toute question ou besoin d'assistance concernant ces documents, veuillez contacter le support FEVEO.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-green-600">Avec Investissements (FEVEO2050)</h3>
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
                  <h3 className="text-sm font-medium text-blue-600">Avec GIE</h3>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
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
               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-600">Solde Total</h3>
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.balance)}</p>
                <p className="text-xs text-green-600 mt-1">+2.5% ce mois</p>
              </div>
            </div>

            {/* Layout en deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendrier d'investissement - Mois actuel seulement */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Calendrier d'investissement</h3>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1">
                    <p className="text-sm text-gray-600">
                      Cycle actuel: <span className="font-medium">Jour {walletData.cycleInfo.currentDay}</span> sur <span className="font-medium">{walletData.cycleInfo.totalDays}</span>
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      Début du cycle: 1 avril 2025
                    </p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    Progression: {Math.round((walletData.cycleInfo.currentDay / walletData.cycleInfo.totalDays) * 100)}% complété 
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(walletData.cycleInfo.currentDay / walletData.cycleInfo.totalDays) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {(() => {
                    // Formatage de la clé pour le mois à afficher
                    const currentMonthKey = `${displayedMonth.getFullYear()}-${(displayedMonth.getMonth() + 1).toString().padStart(2, '0')}`;
                    let currentMonthData = monthlyData[currentMonthKey];
                    
                    // Si on n'a pas de données pour ce mois (rare, mais possible pour les mois lointains)
                    if (!currentMonthData) {
                      // Essayer de construire des données minimales
                      const firstDay = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
                      const lastDay = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 0);
                      const startDay = (firstDay.getDay() + 6) % 7; // Lundi = 0
                      
                      // Créer un ensemble de données minimal pour le mois
                      const minimalMonthData = {
                        startDay: startDay,
                        daysInMonth: lastDay.getDate(),
                        investmentDays: []
                      };
                      
                      // Ajouter au monthlyData
                      monthlyData[currentMonthKey] = minimalMonthData;
                    }
                    
                    const [year, month] = currentMonthKey.split('-');
                    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('fr-FR', { 
                      month: 'long', 
                      year: 'numeric' 
                    });

                    return (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <button 
                            className="p-2 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-gray-200 transition-colors"
                            onClick={goToPreviousMonth}
                            title="Mois précédent"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 18l-6-6 6-6" />
                            </svg>
                          </button>
                          <div className="flex flex-col items-center">
                            <h4 className="text-lg font-bold text-gray-900 capitalize text-center">{monthName}</h4>
                            <button 
                              onClick={goToCurrentMonth} 
                              className="text-xs text-primary-600 hover:text-primary-800 mt-1"
                              title="Aller au mois courant"
                            >
                              Aujourd'hui
                            </button>
                          </div>
                          <button 
                            className="p-2 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-gray-200 transition-colors"
                            onClick={goToNextMonth}
                            title="Mois suivant"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
                        </div>
                        
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
                            const isSuccessfulDay = currentMonthData.successfulDays?.includes(day) || false;
                            const isToday = dateStr === new Date().toISOString().split('T')[0];
                            
                            // Déterminer si le jour est dans le cycle d'investissement (à partir du 1er avril 2025)
                            const currentDate = new Date(parseInt(year), parseInt(month) - 1, day);
                            const startCycleDate = new Date('2025-04-01');
                            const isInCycle = currentDate >= startCycleDate;
                            
                            // Calculer le jour dans le cycle (1 à 1826)
                            let cycleDay = 0;
                            if (isInCycle) {
                              const diffTime = currentDate.getTime() - startCycleDate.getTime();
                              cycleDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                            }
                            
                            return (
                              <div
                                key={day}
                                className={`h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                                  !isInCycle
                                    ? 'bg-gray-100 text-gray-400' // Avant le début du cycle
                                    : isToday
                                      ? 'bg-black text-white ring-2 ring-black shadow-lg' // Jour actuel toujours en noir
                                      : isInvestmentDay
                                        ? isSuccessfulDay
                                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-md' // Jours investis avec succès en vert
                                          : 'bg-red-500 text-white hover:bg-red-600 shadow-md' // Jours investis mais sans succès en rouge
                                        : cycleDay <= walletData.cycleInfo.totalDays
                                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' // Jours futurs dans le cycle
                                          : 'bg-gray-200 text-gray-600' // Après la fin du cycle
                                } cursor-pointer`}
                                title={isInCycle 
                                  ? isToday
                                    ? `Aujourd'hui - Jour ${cycleDay}`
                                    : isInvestmentDay
                                      ? isSuccessfulDay
                                        ? `Jour ${cycleDay} - Investissement réussi`
                                        : `Jour ${cycleDay} - Investissement en attente`
                                      : cycleDay <= walletData.cycleInfo.totalDays
                                        ? `Jour ${cycleDay}: À venir`
                                        : `Hors cycle d'investissement`
                                  : `Avant le début du cycle d'investissement`
                                }
                              >
                                {day}
                              </div>
                            );
                          })}
                        </div>

                        {/* Statistiques du mois */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-green-600">{currentMonthData.investmentDays.length}</p>
                              <p className="text-xs text-gray-600">Jours investis ce mois</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-blue-600">{formatCurrency(currentMonthData.investmentDays.length * 6000)}</p>
                              <p className="text-xs text-gray-600">Montant investi ce mois</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-purple-600">{formatCurrency(walletData.cycleInfo.currentDay * 6000)}</p>
                              <p className="text-xs text-gray-600">Total cycle complet</p>
                            </div>
                          </div>
                        </div>

                        {/* Légende */}
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded shadow-sm"></div>
                            <span className="text-gray-600">Investissement réussi</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded shadow-sm"></div>
                            <span className="text-gray-600">Investissement en attente</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-black rounded ring-1 ring-black"></div>
                            <span className="text-gray-600">Aujourd'hui</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-100 rounded border border-blue-300"></div>
                            <span className="text-gray-600">Jours à venir</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
                            <span className="text-gray-600">Hors cycle</span>
                          </div>
                        </div>
                        
                        {/* Information sur le cycle */}
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 border-dashed rounded text-center text-xs text-gray-600">
                          <p>Cycle d'investissement: <span className="font-medium">1er avril 2025</span> au <span className="font-medium">31 mars 2030</span></p>
                          <p className="mt-1">1826 jours d'investissement à 6000 FCFA/jour</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Transactions récentes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Journal des opérations du GIE</h3>
                  <button
                    onClick={loadTransactions}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    disabled={transactionsLoading}
                  >
                    {transactionsLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent mr-1"></div>
                    ) : (
                      <Activity className="w-4 h-4 mr-1" />
                    )}
                    Actualiser
                  </button>
                </div>
                <div className="p-6">
                  {transactionsLoading && transactions.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p>Aucune transaction trouvée pour ce GIE.</p>
                      <p className="text-sm text-gray-400 mt-1">Les transactions du GIE s'afficheront ici.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {transactions.slice(0, 10).map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              transaction.type === 'investment' 
                                ? 'bg-blue-100'
                                : transaction.type === 'adhesion'
                                ? 'bg-amber-100'
                                : 'bg-green-100'
                            }`}>
                              {transaction.type === 'investment' ? (
                                <ArrowUpRight className="w-5 h-5 text-blue-600" />
                              ) : transaction.type === 'adhesion' ? (
                                <CreditCard className="w-5 h-5 text-amber-600" />
                              ) : (
                                <ArrowDownLeft className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center flex-wrap gap-1">
                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                                  transaction.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                  transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                  transaction.status === 'FAILED' ? 'bg-red-100 text-red-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {transaction.status === 'SUCCESS' ? 'Réussi' :
                                   transaction.status === 'PENDING' ? 'En attente' : 
                                   transaction.status === 'FAILED' ? 'Échoué' : 
                                   transaction.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString('fr-FR', { 
                                  day: 'numeric',
                                  month: 'short', 
                                  year: 'numeric'
                                })}
                                {transaction.method && ` · ${transaction.method}`}
                              </p>
                            </div>
                          </div>
                          <div className={`font-bold text-lg ${
                            transaction.type === 'investment' || transaction.type === 'adhesion'
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            {transaction.type === 'investment' || transaction.type === 'adhesion' ? '-' : '+'}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {transactions.length > 0 && transactionsLoading && (
                    <div className="mt-4 flex justify-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent mr-2"></div>
                        Mise à jour des transactions...
                      </div>
                    </div>
                  )}
                  
                  {transactions.length > 0 && (
                    <button 
                      className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      onClick={() => {
                        // Exporter les transactions ou afficher plus de détails
                        alert('Cette fonctionnalité sera disponible prochainement');
                      }}
                      disabled={transactionsLoading}
                    >
                      <span className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir toutes les transactions
                      </span>
                    </button>
                  )}
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
              { id: 'revenue', name: 'Revenus d\'Activité', icon: BarChart3 },
              { id: 'membres', name: 'Membres', icon: Users },
              { id: 'documents', name: 'Documents', icon: FileText },
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
       {/* Modal d'ajout de membre */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Ajouter un Nouveau Membre</h3>
                <button 
                  onClick={() => setShowAddMemberModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddMember} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom*</label>
                  <input
                    type="text"
                    name="prenom"
                    value={memberForm.prenom}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Prénom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                  <input
                    type="text"
                    name="nom"
                    value={memberForm.nom}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={memberForm.telephone}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 771234567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro CIN*</label>
                  <input
                    type="text"
                    name="cin"
                    value={memberForm.cin}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 1234567890123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de Naissance</label>
                  <input
                    type="date"
                    name="dateNaissance"
                    value={memberForm.dateNaissance}
                    onChange={handleMemberInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre*</label>
                  <select
                    name="genre"
                    value={memberForm.genre}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="femme">Femme</option>
                    <option value="jeune">Jeune</option>
                    <option value="homme">Homme</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <input
                    type="text"
                    name="profession"
                    value={memberForm.profession}
                    onChange={handleMemberInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Profession"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fonction dans le GIE*</label>
                  <select
                    name="fonction"
                    value={memberForm.fonction}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Membre">Membre</option>
                    <option value="Présidente">Présidente</option>
                    <option value="Trésorière">Trésorière</option>
                    <option value="Secrétaire">Secrétaire</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="adresse"
                    value={memberForm.adresse}
                    onChange={handleMemberInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Adresse complète"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter le Membre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal d'édition de membre */}
      {showEditMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Modifier un Membre</h3>
                <button 
                  onClick={() => setShowEditMemberModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditMember} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom*</label>
                  <input
                    type="text"
                    name="prenom"
                    value={memberForm.prenom}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                  <input
                    type="text"
                    name="nom"
                    value={memberForm.nom}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={memberForm.telephone}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro CIN*</label>
                  <input
                    type="text"
                    name="cin"
                    value={memberForm.cin}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de Naissance</label>
                  <input
                    type="date"
                    name="dateNaissance"
                    value={memberForm.dateNaissance}
                    onChange={handleMemberInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre*</label>
                  <select
                    name="genre"
                    value={memberForm.genre}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="femme">Femme</option>
                    <option value="jeune">Jeune</option>
                    <option value="homme">Homme</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fonction dans le GIE*</label>
                  <select
                    name="fonction"
                    value={memberForm.fonction}
                    onChange={handleMemberInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Membre">Membre</option>
                    <option value="Présidente">Présidente</option>
                    <option value="Vice-Président">Vice-Président</option>
                    <option value="Trésorière">Trésorière</option>
                    <option value="Secrétaire">Secrétaire</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    name="statut"
                    value={memberForm.statut}
                    onChange={handleMemberInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="adresse"
                    value={memberForm.adresse}
                    onChange={handleMemberInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-between space-x-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if(confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
                      handleDeleteMember(selectedMember);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </button>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditMemberModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Enregistrer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

     
  );
};

export default WalletDashboard;
