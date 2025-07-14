import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdhesionForm from './components/AdhesionForm';
import GIEDocumentWorkflow from './components/GIEDocumentWorkflow';

interface FormData {
  nomGIE: string;
  nomPresidente: string;
  email: string;
  telephone: string;
  region: string;
  secteur: string;
  nombreMembres: string;
  typeAdhesion: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AdhesionProps {
  onNavigate: (page: string) => void;
}

const Adhesion: React.FC<AdhesionProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showFullForm, setShowFullForm] = useState(false);
  const [showDocumentWorkflow, setShowDocumentWorkflow] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nomGIE: '',
    nomPresidente: '',
    email: '',
    telephone: '',
    region: '',
    secteur: '',
    nombreMembres: '',
    typeAdhesion: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const regions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Kaolack', 
    'Tambacounda', 'Kolda', 'Ziguinchor', 'Fatick', 'Kaffrine',
    'Kédougou', 'Louga', 'Matam', 'Sédhiou'
  ];

  const secteurs = [
    'Agriculture & Maraîchage', 'Élevage & Aviculture', 'Pêche & Aquaculture', 
    'Artisanat & Textile', 'Commerce & Distribution', 'Transformation Alimentaire', 
    'Services & Technologie', 'Écotourisme', 'Énergies Renouvelables'
  ];

  const typesAdhesion = [
    { 
      id: 'standard', 
      nom: 'Adhésion Standard', 
      prix: 20000, 
      description: 'Accès aux services de base',
      avantages: ['Financement projets', 'Formation de base', 'Support technique']
    },
    { 
      id: 'premium', 
      nom: 'Adhésion Premium', 
      prix: 50000, 
      description: 'Accès complet aux services FEVEO',
      avantages: ['Tout Standard +', 'Mentoring dédié', 'Accès marché international', 'Formation avancée']
    }
  ];

  const avantages = [
    {
      icon: TrendingUp,
      title: 'Croissance Garantie',
      description: 'Augmentation moyenne de 300% du chiffre d\'affaires en 2 ans',
      color: 'text-accent-500'
    },
    {
      icon: Users,
      title: 'Réseau National',
      description: 'Rejoignez plus de 15 000 femmes entrepreneures dans 14 régions',
      color: 'text-primary-500'
    },
    {
      icon: Target,
      title: 'Formation Continue',
      description: 'Programmes de formation et certification professionnelle',
      color: 'text-success-500'
    },
    {
      icon: Award,
      title: 'Accès au Marché',
      description: 'Distribution nationale et internationale via notre plateforme',
      color: 'text-accent-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Informations GIE',
      description: 'Détails de votre groupement'
    },
    {
      number: '02',
      title: 'Type d\'adhésion',
      description: 'Choisissez votre formule'
    },
    {
      number: '03',
      title: 'Paiement',
      description: 'Réglement via Wave'
    }
  ];

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.nomGIE.trim()) newErrors.nomGIE = 'Le nom du GIE est requis';
    if (!formData.nomPresidente.trim()) newErrors.nomPresidente = 'Le nom de la présidente est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.region) newErrors.region = 'La région est requise';
    if (!formData.secteur) newErrors.secteur = 'Le secteur est requis';
    if (!formData.nombreMembres) newErrors.nombreMembres = 'Le nombre de membres est requis';
    else if (parseInt(formData.nombreMembres) < 5) newErrors.nombreMembres = 'Minimum 5 membres requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    if (!formData.typeAdhesion) {
      setErrors({ typeAdhesion: 'Veuillez sélectionner un type d\'adhésion' });
      return;
    }

    const selectedType = typesAdhesion.find(t => t.id === formData.typeAdhesion);
    const paymentUrl = `https://pay.wave.com/m/M_sn_t3V8_2xeRR6Z/c/sn/?amount=${selectedType.prix}`;
    
    const message = `🎉 Félicitations ! Votre demande d'adhésion est en cours de traitement.\n\nDétails :\n• GIE: ${formData.nomGIE}\n• Présidente: ${formData.nomPresidente}\n• Type: ${selectedType.nom}\n• Montant: ${selectedType.prix.toLocaleString()} FCFA\n\nVous allez être redirigé vers Wave pour le paiement.`;
    
    alert(message);
    window.open(paymentUrl, '_blank');
    
    // Reset après paiement
    setTimeout(() => {
      setCurrentStep(1);
      setFormData({
        nomGIE: '', nomPresidente: '', email: '', telephone: '',
        region: '', secteur: '', nombreMembres: '', typeAdhesion: ''
      });
      setErrors({});
    }, 2000);
  };

  if (showFullForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onNavigate={onNavigate} />
        <AdhesionForm onBack={() => setShowFullForm(false)} />
        <Footer />
      </div>
    );
  }

  if (showDocumentWorkflow) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header onNavigate={onNavigate} />
        <div className="py-20">
          <GIEDocumentWorkflow 
            initialData={{
              nomGIE: formData.nomGIE,
              presidenteNom: formData.nomPresidente.split(' ').pop() || '',
              presidentePrenom: formData.nomPresidente.split(' ').slice(0, -1).join(' ') || formData.nomPresidente,
              presidenteEmail: formData.email,
              presidenteTelephone: formData.telephone,
              region: formData.region,
              secteurPrincipal: formData.secteur
            }}
            onComplete={(data) => {
              console.log('Workflow terminé:', data);
              setShowDocumentWorkflow(false);
              setCurrentStep(1);
              setFormData({
                nomGIE: '', nomPresidente: '', email: '', telephone: '',
                region: '', secteur: '', nombreMembres: '', typeAdhesion: ''
              });
            }}
            onCancel={() => setShowDocumentWorkflow(false)}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
        
        <div className="relative z-10 container-max mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-accent-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <Users className="w-5 h-5 text-accent-400 mr-3" />
                <span className="text-accent-400 font-medium">Adhésion FEVEO 2050</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-50 leading-tight mb-6">
                Rejoignez l'écosystème
                <span className="block text-accent-400">qui transforme l'Afrique</span>
              </h1>
              
              <p className="text-xl text-neutral-200 mb-8 max-w-4xl mx-auto leading-relaxed">
                Devenez membre de FEVEO 2050 et rejoignez plus de <strong className="text-accent-400">15 000 femmes entrepreneures</strong> qui révolutionnent l'économie africaine grâce à l'agriculture organique et l'innovation.
              </p>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {avantages.map((avantage, index) => (
                <div key={index} className="bg-gradient-to-br from-neutral-50/10 to-accent-500/10 backdrop-blur-sm rounded-2xl p-6 border border-neutral-50/20 hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-neutral-50/20 rounded-xl flex items-center justify-center mb-4">
                    <avantage.icon className={`w-6 h-6 ${avantage.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-50 mb-2">{avantage.title}</h3>
                  <p className="text-sm text-neutral-300">{avantage.description}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-accent-500/20 to-primary-500/20 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20 mb-16">
              <h2 className="text-2xl font-bold text-neutral-50 text-center mb-8">Pourquoi nous rejoindre ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-2">15K+</div>
                  <div className="text-sm text-neutral-300">Femmes entrepreneures</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success-400 mb-2">300%</div>
                  <div className="text-sm text-neutral-300">Croissance moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400 mb-2">14</div>
                  <div className="text-sm text-neutral-300">Régions couvertes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-2">2.5M€</div>
                  <div className="text-sm text-neutral-300">Fonds disponibles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire d'adhésion */}
      <GIEDocumentWorkflow 
            initialData={{
              nomGIE: formData.nomGIE,
              presidenteNom: formData.nomPresidente.split(' ').pop() || '',
              presidentePrenom: formData.nomPresidente.split(' ').slice(0, -1).join(' ') || formData.nomPresidente,
              presidenteEmail: formData.email,
              presidenteTelephone: formData.telephone,
              region: formData.region,
              secteurPrincipal: formData.secteur
            }}
            onComplete={(data) => {
              console.log('Workflow terminé:', data);
              setShowDocumentWorkflow(false);
              setCurrentStep(1);
              setFormData({
                nomGIE: '', nomPresidente: '', email: '', telephone: '',
                region: '', secteur: '', nombreMembres: '', typeAdhesion: ''
              });
            }}
            onCancel={() => setShowDocumentWorkflow(false)}
          />
      

      <Footer />
    </div>
  );
};
export default Adhesion;