import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  MapPin,
  Building,
  User,
  CreditCard,
  AlertCircle,
  Clock,
  Shield
} from 'lucide-react';

interface GIEData {
  // Informations de base
  nomGIE: string;
  presidenteNom: string;
  presidentePrenom: string;
  presidenteCIN: string;
  presidenteAdresse: string;
  presidenteTelephone: string;
  presidenteEmail: string;
  
  // Localisation
  region: string;
  departement: string;
  arrondissement: string;
  commune: string;
  codeRegion: string;
  codeDepartement: string;
  codeArrondissement: string;
  codeCommune: string;
  
  // Membres
  membres: Array<{
    nom: string;
    prenom: string;
    fonction: string;
    cin: string;
    telephone: string;
  }>;
  
  // Activités
  secteurPrincipal: string;
  activites: string[];
  objectifs: string;
  
  // Documents générés
  identifiantGIE: string;
  numeroProtocole: string;
  dateConstitution: string;
}

interface DocumentWorkflowProps {
  initialData?: Partial<GIEData>;
  onComplete?: (data: GIEData) => void;
  onCancel?: () => void;
}

const GIEDocumentWorkflow: React.FC<DocumentWorkflowProps> = ({ 
  initialData = {}, 
  onComplete, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [gieData, setGieData] = useState<GIEData>({
    nomGIE: '',
    presidenteNom: '',
    presidentePrenom: '',
    presidenteCIN: '',
    presidenteAdresse: '',
    presidenteTelephone: '',
    presidenteEmail: '',
    region: '',
    departement: '',
    arrondissement: '',
    commune: '',
    codeRegion: '',
    codeDepartement: '',
    codeArrondissement: '',
    codeCommune: '',
    membres: [],
    secteurPrincipal: '',
    activites: [],
    objectifs: '',
    identifiantGIE: '',
    numeroProtocole: '',
    dateConstitution: new Date().toISOString().split('T')[0],
    ...initialData
  });

  const [generatedDocuments, setGeneratedDocuments] = useState<{
    statuts: boolean;
    reglementInterieur: boolean;
    procesVerbal: boolean;
    demandeAdhesion: boolean;
  }>({
    statuts: false,
    reglementInterieur: false,
    procesVerbal: false,
    demandeAdhesion: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Données géographiques du Sénégal - Structure hiérarchique complète
  const regionsData = {
    'DAKAR': {
      code: '01',
      departements: {
        'DAKAR': {
          code: '01',
          arrondissements: {
            'DAKAR-PLATEAU': { code: '01', communes: ['DAKAR-PLATEAU', 'GUEULE-TAPEE-FASS-COLOBANE'] },
            'GRAND-DAKAR': { code: '02', communes: ['BISCUITERIE', 'MEDINA'] },
            'ALMADIES': { code: '03', communes: ['NGOR', 'OUAKAM', 'YOFF'] },
            'PARCELLES-ASSAINIES': { code: '04', communes: ['PARCELLES-ASSAINIES'] }
          }
        },
        'PIKINE': {
          code: '02',
          arrondissements: {
            'NIAVES': { code: '01', communes: ['NIAVES'] },
            'PIKINE-DAGOUDANE': { code: '02', communes: ['PIKINE'] },
            'THIAROYE': { code: '03', communes: ['THIAROYE-SUR-MER'] }
          }
        },
        'RUFISQUE': {
          code: '03',
          arrondissements: {
            'RUFISQUE-EST': { code: '01', communes: ['RUFISQUE-EST'] },
            'SANGALKAM': { code: '02', communes: ['SANGALKAM'] },
            'DIAMNIADIO': { code: '03', communes: ['DIAMNIADIO'] }
          }
        },
        'GUEDIAWAYE': {
          code: '04',
          arrondissements: {
            'WAKHINANE-NIMZATT': { code: '01', communes: ['WAKHINANE-NIMZATT'] },
            'SAM-NOTAIRE': { code: '02', communes: ['SAM-NOTAIRE'] }
          }
        },
        'KEUR-MASSAR': {
          code: '05',
          arrondissements: {
            'MALIKA': { code: '01', communes: ['MALIKA'] },
            'YEUMBEUL': { code: '02', communes: ['YEUMBEUL-SUD', 'YEUMBEUL-NORD'] },
            'JAXAAY': { code: '03', communes: ['JAXAAY-PARCELLE-NIAKOUL-RAP'] }
          }
        }
      }
    },
    'THIES': {
      code: '02',
      departements: {
        'THIES': {
          code: '01',
          arrondissements: {
            'THIES-NORD': { code: '01', communes: ['THIES-NORD', 'THIES-EST'] },
            'THIES-SUD': { code: '02', communes: ['THIES-SUD', 'THIES-OUEST'] },
            'FANDENE': { code: '03', communes: ['FANDENE', 'TASSETTE'] }
          }
        },
        'TIVAOUANE': {
          code: '02',
          arrondissements: {
            'TIVAOUANE': { code: '01', communes: ['TIVAOUANE', 'NIAKHENE'] },
            'MBORO': { code: '02', communes: ['MBORO', 'TAIBA-NDIAYE'] },
            'MEKHE': { code: '03', communes: ['MEKHE', 'NOTTO'] }
          }
        },
        'MBOUR': {
          code: '03',
          arrondissements: {
            'MBOUR': { code: '01', communes: ['MBOUR', 'THIADIAYE'] },
            'JOAL-FADIOUTH': { code: '02', communes: ['JOAL-FADIOUTH', 'PALMARIN'] },
            'SESSENE': { code: '03', communes: ['SESSENE', 'SANDIARA'] }
          }
        }
      }
    },
    'SAINT-LOUIS': {
      code: '03',
      departements: {
        'SAINT-LOUIS': {
          code: '01',
          arrondissements: {
            'SAINT-LOUIS': { code: '01', communes: ['SAINT-LOUIS'] },
            'GANDON': { code: '02', communes: ['GANDON'] },
            'NDIEBENE-GANDIOLE': { code: '03', communes: ['NDIEBENE-GANDIOLE'] }
          }
        },
        'DAGANA': {
          code: '02',
          arrondissements: {
            'DAGANA': { code: '01', communes: ['DAGANA'] },
            'ROSS-BETHIO': { code: '02', communes: ['ROSS-BETHIO'] },
            'RICHARD-TOLL': { code: '03', communes: ['RICHARD-TOLL'] }
          }
        },
        'PODOR': {
          code: '03',
          arrondissements: {
            'PODOR': { code: '01', communes: ['PODOR'] },
            'GOLERE': { code: '02', communes: ['GOLERE'] },
            'NDIAYENE-PENDAO': { code: '03', communes: ['NDIAYENE-PENDAO'] }
          }
        }
      }
    },
    'DIOURBEL': {
      code: '04',
      departements: {
        'DIOURBEL': {
          code: '01',
          arrondissements: {
            'DIOURBEL': { code: '01', communes: ['DIOURBEL'] },
            'NDOULO': { code: '02', communes: ['NDOULO'] },
            'TOUBA-MOSQUEE': { code: '03', communes: ['TOUBA'] }
          }
        },
        'MBACKE': {
          code: '02',
          arrondissements: {
            'MBACKE': { code: '01', communes: ['MBACKE'] },
            'TAIBA': { code: '02', communes: ['TAIBA'] },
            'DAROU-MOUSTY': { code: '03', communes: ['DAROU-MOUSTY'] }
          }
        },
        'BAMBEY': {
          code: '03',
          arrondissements: {
            'BAMBEY': { code: '01', communes: ['BAMBEY'] },
            'NGOYE': { code: '02', communes: ['NGOYE'] },
            'REFANE': { code: '03', communes: ['REFANE'] }
          }
        }
      }
    },
    'KAOLACK': {
      code: '05',
      departements: {
        'KAOLACK': {
          code: '01',
          arrondissements: {
            'KAOLACK': { code: '01', communes: ['KAOLACK'] },
            'LATMINGUE': { code: '02', communes: ['LATMINGUE'] },
            'NDOFFANE': { code: '03', communes: ['NDOFFANE'] }
          }
        },
        'NIORO-DU-RIP': {
          code: '02',
          arrondissements: {
            'NIORO-DU-RIP': { code: '01', communes: ['NIORO-DU-RIP'] },
            'WACK-NGOUNA': { code: '02', communes: ['WACK-NGOUNA'] },
            'KEUR-BAKA': { code: '03', communes: ['KEUR-BAKA'] }
          }
        },
        'GUINGUINEO': {
          code: '03',
          arrondissements: {
            'GUINGUINEO': { code: '01', communes: ['GUINGUINEO'] },
            'FIMELA': { code: '02', communes: ['FIMELA'] },
            'NGAYENE': { code: '03', communes: ['NGAYENE'] }
          }
        }
      }
    }
  };

  const secteurs = [
    'Agriculture & Maraîchage',
    'Élevage & Aviculture', 
    'Pêche & Aquaculture',
    'Transformation Alimentaire',
    'Artisanat & Textile',
    'Commerce & Distribution',
    'Services & Écotourisme'
  ];

  const activitesPossibles = [
    'Production agricole bio',
    'Maraîchage organique',
    'Élevage de volailles',
    'Élevage de petits ruminants',
    'Pisciculture',
    'Transformation de céréales',
    'Transformation de fruits',
    'Artisanat traditionnel',
    'Textile et couture',
    'Commerce de produits locaux',
    'Écotourisme communautaire'
  ];

  const steps = [
    {
      number: 1,
      title: 'Statuts du GIE',
      description: 'Renseigner les statuts et générer l\'identifiant'
    },
    {
      number: 2,
      title: 'Règlement Intérieur',
      description: 'Compléter automatiquement le règlement'
    },
    {
      number: 3,
      title: 'Procès-Verbal',
      description: 'Constitution et nomination des membres'
    },
    {
      number: 4,
      title: 'Demande d\'Adhésion',
      description: 'Finalisation et paiement Wave'
    }
  ];

  // Génération de l'identifiant GIE
  const generateGIEIdentifier = () => {
    if (!gieData.codeRegion || !gieData.codeDepartement || !gieData.codeArrondissement || !gieData.codeCommune) {
      return '';
    }
    
    const timestamp = Date.now().toString().slice(-6);
    const numeroProtocole = `${timestamp}`;
    const identifiant = `FEVEO-${gieData.codeRegion}-${gieData.codeDepartement}-${gieData.codeArrondissement}-${gieData.codeCommune}-${numeroProtocole}`;
    
    return identifiant;
  };

  // Génération des documents
  const generateDocument = (type: string) => {
    switch (type) {
      case 'statuts':
        return generateStatuts();
      case 'reglement':
        return generateReglementInterieur();
      case 'procesVerbal':
        return generateProcesVerbal();
      case 'demande':
        return generateDemandeAdhesion();
      default:
        return '';
    }
  };

  const generateStatuts = () => {
    return `
STATUTS DU GROUPEMENT D'INTÉRÊT ÉCONOMIQUE
"${gieData.nomGIE}"

IDENTIFIANT FEVEO: ${gieData.identifiantGIE}

ARTICLE 1 - CONSTITUTION
Il est constitué entre les soussignés un Groupement d'Intérêt Économique dénommé "${gieData.nomGIE}", 
affilié à la plateforme FEVEO 2050, régi par les présents statuts et la réglementation en vigueur.

ARTICLE 2 - SIÈGE SOCIAL
Le siège social est fixé à ${gieData.commune}, ${gieData.arrondissement}, ${gieData.departement}, ${gieData.region}.

ARTICLE 3 - OBJET
Le GIE a pour objet :
- ${gieData.activites.join('\n- ')}
- Toute activité connexe ou complémentaire à l'objet principal

ARTICLE 4 - DURÉE
La durée du GIE est fixée à 99 ans à compter de son immatriculation.

ARTICLE 5 - MEMBRES
Le GIE est composé de ${gieData.membres.length} membres :
${gieData.membres.map(m => `- ${m.prenom} ${m.nom} (${m.fonction})`).join('\n')}

ARTICLE 6 - ADMINISTRATION
Le GIE est administré par Mme ${gieData.presidentePrenom} ${gieData.presidenteNom}, 
Présidente, domiciliée à ${gieData.presidenteAdresse}.

ARTICLE 7 - AFFILIATION FEVEO 2050
Le présent GIE adhère à la plateforme d'investissement FEVEO 2050 
sous le protocole n° ${gieData.numeroProtocole}.

Fait à ${gieData.commune}, le ${new Date().toLocaleDateString('fr-FR')}
    `;
  };

  const generateReglementInterieur = () => {
    return `
RÈGLEMENT INTÉRIEUR DU GIE "${gieData.nomGIE}"
IDENTIFIANT FEVEO: ${gieData.identifiantGIE}

CHAPITRE I - ORGANISATION ET FONCTIONNEMENT

Article 1 - Réunions
- Assemblée générale ordinaire : trimestrielle
- Assemblée générale extraordinaire : sur convocation
- Quorum : 2/3 des membres

Article 2 - Rôles et responsabilités
- Présidente : ${gieData.presidentePrenom} ${gieData.presidenteNom}
- Représentation légale et gestion courante
- Coordination avec FEVEO 2050

CHAPITRE II - ACTIVITÉS ET PROJETS

Article 3 - Secteur principal
${gieData.secteurPrincipal}

Article 4 - Activités autorisées
${gieData.activites.map(a => `- ${a}`).join('\n')}

CHAPITRE III - GESTION FINANCIÈRE

Article 5 - Comptes et comptabilité
- Tenue obligatoire d'une comptabilité simplifiée
- Rapport financier trimestriel à FEVEO 2050
- Participation aux bénéfices selon les statuts

Article 6 - Partenariat FEVEO 2050
- Respect des standards de qualité FEVEO
- Formation continue des membres
- Accès aux circuits de distribution FEVEO

Fait à ${gieData.commune}, le ${new Date().toLocaleDateString('fr-FR')}
    `;
  };

  const generateProcesVerbal = () => {
    return `
PROCÈS-VERBAL DE CONSTITUTION ET DE NOMINATION
GIE "${gieData.nomGIE}"

Date de constitution : ${new Date(gieData.dateConstitution).toLocaleDateString('fr-FR')}
Lieu : ${gieData.commune}, ${gieData.region}
Identifiant FEVEO : ${gieData.identifiantGIE}

MEMBRES FONDATEURS :
${gieData.membres.map((m, i) => `
${i + 1}. ${m.prenom} ${m.nom}
   Fonction : ${m.fonction}
   CIN : ${m.cin}
   Téléphone : ${m.telephone}
`).join('')}

DÉCISIONS PRISES :

1. CONSTITUTION
Il est décidé à l'unanimité la constitution du GIE "${gieData.nomGIE}".

2. ADOPTION DES STATUTS
Les statuts présentés sont adoptés à l'unanimité.

3. NOMINATION DU BUREAU
- Présidente : Mme ${gieData.presidentePrenom} ${gieData.presidenteNom}
- Acceptation : Oui

4. AFFILIATION FEVEO 2050
Le GIE décide d'adhérer à la plateforme FEVEO 2050 sous le protocole n° ${gieData.numeroProtocole}.

5. POUVOIRS
Tous pouvoirs sont donnés à la Présidente pour accomplir les formalités 
d'immatriculation et d'affiliation à FEVEO 2050.

Signatures des membres :
${gieData.membres.map(m => `${m.prenom} ${m.nom} : _______________`).join('\n')}

Fait à ${gieData.commune}, le ${new Date().toLocaleDateString('fr-FR')}
    `;
  };

  const generateDemandeAdhesion = () => {
    return `
DEMANDE D'ADHÉSION ET D'AFFILIATION À LA PLATEFORME FEVEO 2050

IDENTIFIANT GIE : ${gieData.identifiantGIE}
PROTOCOLE N° : ${gieData.numeroProtocole}

INFORMATIONS DU GIE :
- Dénomination : ${gieData.nomGIE}
- Secteur d'activité : ${gieData.secteurPrincipal}
- Localisation : ${gieData.commune}, ${gieData.arrondissement}, ${gieData.departement}, ${gieData.region}
- Nombre de membres : ${gieData.membres.length}

PRÉSIDENTE :
- Nom complet : ${gieData.presidentePrenom} ${gieData.presidenteNom}
- CIN : ${gieData.presidenteCIN}
- Téléphone : ${gieData.presidenteTelephone}
- Email : ${gieData.presidenteEmail}
- Adresse : ${gieData.presidenteAdresse}

ACTIVITÉS DÉCLARÉES :
${gieData.activites.map(a => `- ${a}`).join('\n')}

OBJECTIFS :
${gieData.objectifs}

ENGAGEMENT :
Le GIE "${gieData.nomGIE}" s'engage à respecter :
- Les valeurs et principes de FEVEO 2050
- Les standards de qualité en agriculture biologique
- Les règles de transparence et de gouvernance
- La participation active aux programmes de formation

TYPE D'ADHÉSION DEMANDÉE :
☐ Standard (20 000 FCFA)
☐ Premium (50 000 FCFA)

PIÈCES JOINTES :
☐ Statuts du GIE
☐ Règlement intérieur
☐ Procès-verbal de constitution
☐ Copies CIN des membres
☐ Justificatifs de domicile

Fait à ${gieData.commune}, le ${new Date().toLocaleDateString('fr-FR')}

Signature de la Présidente,
${gieData.presidentePrenom} ${gieData.presidenteNom}
    `;
  };

  const updateGIEData = (field: string, value: any) => {
    setGieData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addMember = () => {
    const newMember = {
      nom: '',
      prenom: '',
      fonction: 'Membre',
      cin: '',
      telephone: ''
    };
    setGieData(prev => ({
      ...prev,
      membres: [...prev.membres, newMember]
    }));
  };

  const updateMember = (index: number, field: string, value: string) => {
    setGieData(prev => ({
      ...prev,
      membres: prev.membres.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeMember = (index: number) => {
    setGieData(prev => ({
      ...prev,
      membres: prev.membres.filter((_, i) => i !== index)
    }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!gieData.nomGIE.trim()) newErrors.nomGIE = 'Nom du GIE requis';
    if (!gieData.presidenteNom.trim()) newErrors.presidenteNom = 'Nom de la présidente requis';
    if (!gieData.presidentePrenom.trim()) newErrors.presidentePrenom = 'Prénom requis';
    if (!gieData.presidenteCIN.trim()) newErrors.presidenteCIN = 'CIN requis';
    if (!gieData.region) newErrors.region = 'Région requise';
    if (!gieData.departement) newErrors.departement = 'Département requis';
    if (!gieData.arrondissement) newErrors.arrondissement = 'Arrondissement requis';
    if (!gieData.commune) newErrors.commune = 'Commune requise';
    if (gieData.membres.length < 4) newErrors.membres = 'Minimum 5 membres (présidente + 4)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateIdentifier = () => {
    if (!gieData.codeRegion || !gieData.codeDepartement || !gieData.codeArrondissement || !gieData.codeCommune) return;
    
    const identifier = generateGIEIdentifier();
    const protocol = Date.now().toString().slice(-6);
    
    setGieData(prev => ({
      ...prev,
      identifiantGIE: identifier,
      numeroProtocole: protocol
    }));
    
    setGeneratedDocuments(prev => ({ ...prev, statuts: true }));
  };

  const downloadDocument = (type: string, filename: string) => {
    const content = generateDocument(type);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const proceedToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      
      // Auto-génération des documents suivants
      if (currentStep === 1) {
        setGeneratedDocuments(prev => ({ ...prev, reglementInterieur: true }));
      } else if (currentStep === 2) {
        setGeneratedDocuments(prev => ({ ...prev, procesVerbal: true }));
      } else if (currentStep === 3) {
        setGeneratedDocuments(prev => ({ ...prev, demandeAdhesion: true }));
      }
    }
  };

  const handleFinalSubmission = () => {
    const paymentUrl = 'https://pay.wave.com/m/M_sn_t3V8_2xeRR6Z/c/sn/?amount=20000';
    
    const message = `🎉 Dossier d'adhésion complet !\n\nGIE: ${gieData.nomGIE}\nIdentifiant: ${gieData.identifiantGIE}\nProtocole: ${gieData.numeroProtocole}\n\nTous les documents ont été générés. Redirection vers Wave pour le paiement de l'adhésion.`;
    
    alert(message);
    window.open(paymentUrl, '_blank');
    
    if (onComplete) {
      onComplete(gieData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          Parcours d'Adhésion GIE FEVEO 2050
        </h1>
        <p className="text-neutral-600">
          Processus complet de constitution et d'adhésion avec génération automatique des documents
        </p>
      </div>

      {/* Indicateur de progression */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                currentStep > step.number ? 'bg-success-500 border-success-500 text-white' :
                currentStep === step.number ? 'bg-accent-500 border-accent-500 text-white' :
                'bg-neutral-100 border-neutral-300 text-neutral-500'
              }`}>
                {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-4 ${
                  currentStep > step.number ? 'bg-success-500' : 'bg-neutral-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center" style={{ width: '180px' }}>
              <h4 className="font-semibold text-neutral-900 text-sm">{step.title}</h4>
              <p className="text-xs text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contenu selon l'étape */}
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
        
        {/* Étape 1: Statuts du GIE */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <FileText className="w-16 h-16 text-accent-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Statuts du GIE FEVEO</h2>
              <p className="text-neutral-600">
                Renseignez les informations pour générer l'identifiant et les statuts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom du GIE *
                </label>
                <input
                  type="text"
                  value={gieData.nomGIE}
                  onChange={(e) => updateGIEData('nomGIE', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                  placeholder="Ex: GIE Femmes Agricultrices de..."
                />
                {errors.nomGIE && <p className="text-red-500 text-sm mt-1">{errors.nomGIE}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Secteur principal *
                </label>
                <select
                  value={gieData.secteurPrincipal}
                  onChange={(e) => updateGIEData('secteurPrincipal', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Sélectionnez le secteur</option>
                  {secteurs.map(secteur => (
                    <option key={secteur} value={secteur}>{secteur}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Prénom de la Présidente *
                </label>
                <input
                  type="text"
                  value={gieData.presidentePrenom}
                  onChange={(e) => updateGIEData('presidentePrenom', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                />
                {errors.presidentePrenom && <p className="text-red-500 text-sm mt-1">{errors.presidentePrenom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom de la Présidente *
                </label>
                <input
                  type="text"
                  value={gieData.presidenteNom}
                  onChange={(e) => updateGIEData('presidenteNom', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                />
                {errors.presidenteNom && <p className="text-red-500 text-sm mt-1">{errors.presidenteNom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  CIN de la Présidente *
                </label>
                <input
                  type="text"
                  value={gieData.presidenteCIN}
                  onChange={(e) => updateGIEData('presidenteCIN', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                />
                {errors.presidenteCIN && <p className="text-red-500 text-sm mt-1">{errors.presidenteCIN}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={gieData.presidenteTelephone}
                  onChange={(e) => updateGIEData('presidenteTelephone', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                  placeholder="+221 XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={gieData.presidenteEmail}
                  onChange={(e) => updateGIEData('presidenteEmail', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Région *
                </label>
                <select
                  value={gieData.region}
                  onChange={(e) => {
                    const selectedRegion = e.target.value;
                    updateGIEData('region', selectedRegion);
                    updateGIEData('codeRegion', regionsData[selectedRegion]?.code || '');
                    // Reset des niveaux inférieurs
                    updateGIEData('departement', '');
                    updateGIEData('codeDepartement', '');
                    updateGIEData('arrondissement', '');
                    updateGIEData('codeArrondissement', '');
                    updateGIEData('commune', '');
                    updateGIEData('codeCommune', '');
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Sélectionnez la région</option>
                  {Object.keys(regionsData).map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Département *
                </label>
                <select
                  value={gieData.departement}
                  disabled={!gieData.region}
                  onChange={(e) => {
                    const selectedDepartement = e.target.value;
                    updateGIEData('departement', selectedDepartement);
                    updateGIEData('codeDepartement', regionsData[gieData.region]?.departements[selectedDepartement]?.code || '');
                    // Reset des niveaux inférieurs
                    updateGIEData('arrondissement', '');
                    updateGIEData('codeArrondissement', '');
                    updateGIEData('commune', '');
                    updateGIEData('codeCommune', '');
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 disabled:bg-neutral-100"
                >
                  <option value="">Sélectionnez le département</option>
                  {gieData.region && regionsData[gieData.region]?.departements && 
                    Object.keys(regionsData[gieData.region].departements).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Arrondissement *
                </label>
                <select
                  value={gieData.arrondissement}
                  disabled={!gieData.departement}
                  onChange={(e) => {
                    const selectedArrondissement = e.target.value;
                    updateGIEData('arrondissement', selectedArrondissement);
                    updateGIEData('codeArrondissement', 
                      regionsData[gieData.region]?.departements[gieData.departement]?.arrondissements[selectedArrondissement]?.code || ''
                    );
                    // Reset commune
                    updateGIEData('commune', '');
                    updateGIEData('codeCommune', '');
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 disabled:bg-neutral-100"
                >
                  <option value="">Sélectionnez l'arrondissement</option>
                  {gieData.departement && regionsData[gieData.region]?.departements[gieData.departement]?.arrondissements &&
                    Object.keys(regionsData[gieData.region].departements[gieData.departement].arrondissements).map(arr => (
                      <option key={arr} value={arr}>{arr}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Commune *
                </label>
                <select
                  value={gieData.commune}
                  disabled={!gieData.arrondissement}
                  onChange={(e) => {
                    const selectedCommune = e.target.value;
                    updateGIEData('commune', selectedCommune);
                    // Génération du code commune basé sur l'index + 1
                    const communes = regionsData[gieData.region]?.departements[gieData.departement]?.arrondissements[gieData.arrondissement]?.communes || [];
                    const communeIndex = communes.indexOf(selectedCommune);
                    const codeCommune = String(communeIndex + 1).padStart(2, '0');
                    updateGIEData('codeCommune', codeCommune);
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 disabled:bg-neutral-100"
                >
                  <option value="">Sélectionnez la commune</option>
                  {gieData.arrondissement && regionsData[gieData.region]?.departements[gieData.departement]?.arrondissements[gieData.arrondissement]?.communes &&
                    regionsData[gieData.region].departements[gieData.departement].arrondissements[gieData.arrondissement].communes.map(commune => (
                      <option key={commune} value={commune}>{commune}</option>
                    ))
                  }
                </select>
                {errors.commune && <p className="text-red-500 text-sm mt-1">{errors.commune}</p>}
              </div>
            </div>

            {/* Adresse complète */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Adresse complète de la Présidente
              </label>
              <textarea
                value={gieData.presidenteAdresse}
                onChange={(e) => updateGIEData('presidenteAdresse', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                rows={3}
                placeholder="Adresse complète..."
              />
            </div>

            {/* Activités */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Activités du GIE
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activitesPossibles.map(activite => (
                  <label key={activite} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={gieData.activites.includes(activite)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateGIEData('activites', [...gieData.activites, activite]);
                        } else {
                          updateGIEData('activites', gieData.activites.filter(a => a !== activite));
                        }
                      }}
                      className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="text-sm text-neutral-700">{activite}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Membres */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Membres du GIE (minimum 5 incluant la présidente)
                </h3>
                <button
                  onClick={addMember}
                  className="btn-accent text-sm px-4 py-2"
                >
                  Ajouter un membre
                </button>
              </div>

              {gieData.membres.map((member, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg mb-4">
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={member.prenom}
                    onChange={(e) => updateMember(index, 'prenom', e.target.value)}
                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={member.nom}
                    onChange={(e) => updateMember(index, 'nom', e.target.value)}
                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500"
                  />
                  <select
                    value={member.fonction}
                    onChange={(e) => updateMember(index, 'fonction', e.target.value)}
                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="Membre">Membre</option>
                    <option value="Secrétaire">Secrétaire</option>
                    <option value="Trésorière">Trésorière</option>
                    <option value="Vice-Présidente">Vice-Présidente</option>
                  </select>
                  <input
                    type="text"
                    placeholder="CIN"
                    value={member.cin}
                    onChange={(e) => updateMember(index, 'cin', e.target.value)}
                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      value={member.telephone}
                      onChange={(e) => updateMember(index, 'telephone', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-accent-500"
                    />
                    <button
                      onClick={() => removeMember(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {errors.membres && <p className="text-red-500 text-sm mt-1">{errors.membres}</p>}
            </div>

            {/* Génération de l'identifiant */}
            {gieData.region && gieData.departement && gieData.arrondissement && gieData.commune && (
              <div className="bg-accent-50 p-6 rounded-lg border border-accent-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Génération de l'identifiant GIE
                </h3>
                
                {/* Affichage de la localisation complète */}
                <div className="mb-4 p-3 bg-white rounded border">
                  <p className="text-sm text-neutral-600 mb-2">Localisation administrative :</p>
                  <p className="font-medium text-neutral-900">
                    {gieData.commune} → {gieData.arrondissement} → {gieData.departement} → {gieData.region}
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Codes : {gieData.codeRegion}-{gieData.codeDepartement}-{gieData.codeArrondissement}-{gieData.codeCommune}
                  </p>
                </div>

                {!gieData.identifiantGIE ? (
                  <button
                    onClick={handleGenerateIdentifier}
                    className="btn-accent"
                  >
                    Générer l'identifiant FEVEO
                  </button>
                ) : (
                  <div>
                    <p className="text-sm text-neutral-600 mb-2">Identifiant généré :</p>
                    <p className="font-mono text-lg font-bold text-accent-600 mb-4 p-2 bg-white rounded border">
                      {gieData.identifiantGIE}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => downloadDocument('statuts', `Statuts_${gieData.nomGIE.replace(/\s+/g, '_')}.txt`)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger les Statuts
                      </button>
                      {generatedDocuments.statuts && (
                        <CheckCircle className="w-6 h-6 text-success-500" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-6">
              {onCancel && (
                <button onClick={onCancel} className="btn-secondary">
                  Annuler
                </button>
              )}
              <button
                onClick={() => {
                  if (validateStep1() && gieData.identifiantGIE) {
                    proceedToNextStep();
                  }
                }}
                disabled={!gieData.identifiantGIE}
                className={`btn-accent flex items-center gap-2 ${
                  !gieData.identifiantGIE ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Étape 2: Règlement Intérieur */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <Building className="w-16 h-16 text-accent-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Règlement Intérieur</h2>
              <p className="text-neutral-600">
                Complétez automatiquement le règlement intérieur du GIE
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Informations du GIE</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-600">Nom :</span>
                  <span className="font-medium ml-2">{gieData.nomGIE}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Identifiant :</span>
                  <span className="font-mono font-bold ml-2">{gieData.identifiantGIE}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Secteur :</span>
                  <span className="font-medium ml-2">{gieData.secteurPrincipal}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Localisation :</span>
                  <span className="font-medium ml-2">{gieData.commune}, {gieData.region}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Objectifs et vision du GIE
              </label>
              <textarea
                value={gieData.objectifs}
                onChange={(e) => updateGIEData('objectifs', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
                rows={4}
                placeholder="Décrivez les objectifs et la vision de votre GIE..."
              />
            </div>

            <div className="bg-success-50 p-6 rounded-lg border border-success-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-success-500" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  Règlement Intérieur Généré
                </h3>
              </div>
              <p className="text-success-700 mb-4">
                Le règlement intérieur a été automatiquement généré selon les standards FEVEO 2050.
              </p>
              <button
                onClick={() => downloadDocument('reglement', `Reglement_Interieur_${gieData.nomGIE.replace(/\s+/g, '_')}.txt`)}
                className="btn-success flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger le Règlement Intérieur
              </button>
            </div>

            <div className="flex justify-between pt-6">
              <button 
                onClick={() => setCurrentStep(1)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <button
                onClick={proceedToNextStep}
                className="btn-accent flex items-center gap-2"
              >
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Étape 3: Procès-Verbal */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <User className="w-16 h-16 text-accent-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Procès-Verbal de Constitution</h2>
              <p className="text-neutral-600">
                Constitution et nomination des membres du bureau
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Récapitulatif des membres</h3>
              <div className="space-y-3">
                <div className="p-3 bg-accent-100 rounded-lg">
                  <div className="font-semibold text-accent-800">
                    Présidente : {gieData.presidentePrenom} {gieData.presidenteNom}
                  </div>
                  <div className="text-sm text-accent-600">
                    CIN : {gieData.presidenteCIN} • Tél : {gieData.presidenteTelephone}
                  </div>
                </div>
                {gieData.membres.map((member, index) => (
                  <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                    <div className="font-medium">
                      {member.fonction} : {member.prenom} {member.nom}
                    </div>
                    <div className="text-sm text-neutral-600">
                      CIN : {member.cin} • Tél : {member.telephone}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date de constitution
              </label>
              <input
                type="date"
                value={gieData.dateConstitution}
                onChange={(e) => updateGIEData('dateConstitution', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div className="bg-success-50 p-6 rounded-lg border border-success-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-success-500" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  Procès-Verbal Généré
                </h3>
              </div>
              <p className="text-success-700 mb-4">
                Le procès-verbal de constitution et de nomination a été automatiquement généré.
              </p>
              <button
                onClick={() => downloadDocument('procesVerbal', `PV_Constitution_${gieData.nomGIE.replace(/\s+/g, '_')}.txt`)}
                className="btn-success flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger le Procès-Verbal
              </button>
            </div>

            <div className="flex justify-between pt-6">
              <button 
                onClick={() => setCurrentStep(2)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <button
                onClick={proceedToNextStep}
                className="btn-accent flex items-center gap-2"
              >
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Étape 4: Demande d'Adhésion */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-accent-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Demande d'Adhésion FEVEO 2050</h2>
              <p className="text-neutral-600">
                Finalisation et soumission à la validation
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Dossier complet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">GIE :</span>
                    <span className="font-medium">{gieData.nomGIE}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Identifiant :</span>
                    <span className="font-mono font-bold">{gieData.identifiantGIE}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Protocole :</span>
                    <span className="font-mono font-bold">{gieData.numeroProtocole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Présidente :</span>
                    <span className="font-medium">{gieData.presidentePrenom} {gieData.presidenteNom}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Secteur :</span>
                    <span className="font-medium">{gieData.secteurPrincipal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Localisation :</span>
                    <span className="font-medium">{gieData.commune}, {gieData.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Membres :</span>
                    <span className="font-medium">{gieData.membres.length + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Activités :</span>
                    <span className="font-medium">{gieData.activites.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents générés */}
            <div className="bg-success-50 p-6 rounded-lg border border-success-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Documents générés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-success-700">Statuts du GIE</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-success-700">Règlement Intérieur</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-success-700">Procès-Verbal</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent-500" />
                  <span className="text-accent-700">Demande d'Adhésion</span>
                </div>
              </div>
            </div>

            {/* Type d'adhésion */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Type d'adhésion</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-accent-200 rounded-lg p-6 hover:border-accent-500 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold">Standard</h4>
                    <div className="text-2xl font-bold text-accent-600">20 000 FCFA</div>
                  </div>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li>• Accès aux financements</li>
                    <li>• Formation de base</li>
                    <li>• Support technique</li>
                    <li>• Réseau FEVEO</li>
                  </ul>
                </div>
                <div className="border-2 border-primary-200 rounded-lg p-6 hover:border-primary-500 transition-colors opacity-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold">Premium</h4>
                    <div className="text-2xl font-bold text-primary-600">50 000 FCFA</div>
                  </div>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li>• Tout Standard +</li>
                    <li>• Mentoring dédié</li>
                    <li>• Accès marché international</li>
                    <li>• Formation avancée</li>
                  </ul>
                  <div className="mt-4 text-xs text-neutral-500">Bientôt disponible</div>
                </div>
              </div>
            </div>

            {/* Actions finales */}
            <div className="space-y-4">
              <button
                onClick={() => downloadDocument('demande', `Demande_Adhesion_${gieData.nomGIE.replace(/\s+/g, '_')}.txt`)}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger la Demande d'Adhésion
              </button>
              
              <div className="bg-accent-50 p-4 rounded-lg border border-accent-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-accent-700">
                    <p className="font-medium mb-1">Prochaines étapes :</p>
                    <p>1. Téléchargez tous les documents générés</p>
                    <p>2. Procédez au paiement de l'adhésion via Wave</p>
                    <p>3. Votre dossier sera soumis à validation FEVEO</p>
                    <p>4. Vous recevrez votre confirmation d'adhésion par email</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button 
                onClick={() => setCurrentStep(3)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <button
                onClick={handleFinalSubmission}
                className="btn-success text-lg px-8 py-3 flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Finaliser et Payer (20 000 FCFA)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GIEDocumentWorkflow;
