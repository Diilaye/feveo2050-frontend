import React, { useState } from 'react';
import { 
  Shield, 
  CreditCard, 
  Wallet, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Smartphone,
  FileText,
  Lock,
  User,
  Building,
  DollarSign,
  ArrowRight,
  Download,
  QrCode,
  Loader2
} from 'lucide-react';
import { useGIEValidation, GIEValidationErrorComponent } from '../services/gieValidationService';

interface GieData {
  identification: string;
  nom: string;
  presidenteNom: string;
  presidenteEmail: string;
  presidenteTelephone: string;
  region: string;
  nombreMembres: number;
}

interface SubscriptionData {
  nombreParts: number;
  typeInvestissement: string;
  objectifProjet: string;
  secteurActivite: string;
  dureeInvestissement?: string;
  descriptionProjet?: string;
  montantTotal?: number;
}

interface PaymentData {
  operateur: string;
  numeroTelephone: string;
  codePin: string;
  montantTotal: number;
}

interface FormErrors {
  identification?: string;
  nom?: string;
  presidenteNom?: string;
  presidenteEmail?: string;
  region?: string;
  nombreParts?: string;
  typeInvestissement?: string;
  objectifProjet?: string;
  operateur?: string;
  numeroTelephone?: string;
  codePin?: string;
}

const InvestmentSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingGIE, setIsLoadingGIE] = useState(false);
  const [validatedGIE, setValidatedGIE] = useState(null);
  
  // Service de validation GIE
  const { validationError, isValidating, validateGIE, clearError } = useGIEValidation();
  
  const [gieData, setGieData] = useState<GieData>({
    identification: '',
    nom: '',
    presidenteNom: '',
    presidenteEmail: '',
    presidenteTelephone: '',
    region: '',
    nombreMembres: 0
  });
  
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    nombreParts: 0,
    typeInvestissement: '',
    objectifProjet: '',
    secteurActivite: '',
    dureeInvestissement: '',
    descriptionProjet: '',
    montantTotal: 0
  });

  const [paymentData, setPaymentData] = useState<PaymentData & { showPin: boolean }>({
    operateur: '',
    numeroTelephone: '',
    codePin: '',
    montantTotal: 0,
    showPin: false
  });

  const [faceVerification, setFaceVerification] = useState({
    isVerified: false,
    isProcessing: false,
    confidence: 0
  });

  const [walletGenerated, setWalletGenerated] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const steps = [
    { id: 1, title: 'Identification GIE', icon: Building },
    { id: 2, title: 'Fiche Souscription', icon: FileText },
    { id: 3, title: 'Vérification Faciale', icon: Camera },
    { id: 4, title: 'Paiement Mobile', icon: Smartphone },
    { id: 5, title: 'Wallet GIE', icon: Wallet }
  ];

  const regions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Kaolack', 
    'Tambacounda', 'Kolda', 'Ziguinchor', 'Fatick', 'Kaffrine',
    'Kédougou', 'Louga', 'Matam', 'Sédhiou'
  ];

  const secteurs = [
    'Agriculture', 'Élevage', 'Pêche', 'Artisanat', 'Commerce',
    'Transformation alimentaire', 'Textile', 'Services', 'Technologie'
  ];

  const operateurs = [
    { name: 'Orange Money', code: 'orange', logo: '🟠' },
    { name: 'Free Money', code: 'free', logo: '🔵' },
    { name: 'Expresso', code: 'expresso', logo: '🟣' },
    { name: 'Joni Joni', code: 'joni', logo: '🟢' }
  ];

  const typesInvestissement = [
    { value: 'production', label: 'Production Agricole', min: 50000, max: 2000000 },
    { value: 'transformation', label: 'Transformation', min: 100000, max: 5000000 },
    { value: 'commerce', label: 'Commerce/Distribution', min: 25000, max: 1000000 },
    { value: 'mixte', label: 'Projet Mixte', min: 75000, max: 3000000 }
  ];

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};
    
    switch (step) {
      case 1:
        if (!gieData.identification.trim()) newErrors.identification = 'Identification requise';
        if (!gieData.nom.trim()) newErrors.nom = 'Nom du GIE requis';
        if (!gieData.presidenteNom.trim()) newErrors.presidenteNom = 'Nom de la présidente requis';
        if (!gieData.presidenteEmail.trim()) newErrors.presidenteEmail = 'Email requis';
        if (!gieData.region) newErrors.region = 'Région requise';
        break;
      case 2:
        if (!subscriptionData.nombreParts) newErrors.nombreParts = 'Nombre de parts requis';
        if (!subscriptionData.typeInvestissement) newErrors.typeInvestissement = 'Type d\'investissement requis';
        if (!subscriptionData.objectifProjet.trim()) newErrors.objectifProjet = 'Objectif du projet requis';
        break;
      case 4:
        if (!paymentData.operateur) newErrors.operateur = 'Opérateur requis';
        if (!paymentData.numeroTelephone.trim()) newErrors.numeroTelephone = 'Numéro requis';
        if (!paymentData.codePin.trim()) newErrors.codePin = 'Code PIN requis';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Nouvelle fonction pour valider le GIE côté backend
  const handleGIEValidation = async () => {
    if (!gieData.identification.trim()) {
      setErrors({ identification: 'Identification requise' });
      return;
    }

    setIsLoadingGIE(true);
    clearError();

    try {
      // Simulation d'appel API pour valider le GIE
      const response = await validateGIE(gieData.identification, async (gieId) => {
        // Ici on ferait l'appel réel à l'API
        const res = await fetch(`http://localhost:5000/api/investissements/gie/${gieId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        return await res.json();
      });

      // Si la validation réussit, on récupère les données du GIE
      setValidatedGIE(response);
      setCurrentStep(2);
      
    } catch (error) {
      console.error('Erreur validation GIE:', error);
      // L'erreur sera gérée par le composant d'erreur
    } finally {
      setIsLoadingGIE(false);
    }
  };

  const handleNext = () => {
    // Pour l'étape 1, on utilise la validation GIE backend
    if (currentStep === 1) {
      handleGIEValidation();
      return;
    }
    
    // Pour les autres étapes, validation normale
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        // Calculer le montant total
        const prixPart = 10000; // 10 000 FCFA par part
        setSubscriptionData(prev => ({
          ...prev,
          montantTotal: prev.nombreParts * prixPart
        }));
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFaceVerification = () => {
    setFaceVerification(prev => ({ ...prev, isProcessing: true }));
    
    // Simulation de la reconnaissance faciale
    setTimeout(() => {
      const confidence = Math.random() * 30 + 70; // 70-100%
      setFaceVerification({
        isProcessing: false,
        isVerified: confidence > 75,
        confidence: Math.round(confidence)
      });
    }, 3000);
  };

  const handlePayment = () => {
    if (validateStep(4)) {
      // Simulation du paiement
      setTimeout(() => {
        setWalletGenerated(true);
        setCurrentStep(5);
      }, 2000);
    }
  };

  const generateWalletId = () => {
    return `FEVEO-${gieData.identification}-${Date.now().toString().slice(-6)}`;
  };

  return (
    <section id="investir" className="py-20 bg-neutral-100">
      <div className="container-max section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Souscrire aux
            <span className="block text-accent-500">Parts d'Investissement</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Processus sécurisé de souscription avec identification biométrique et génération automatique du Wallet GIE
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-accent-500 text-neutral-50' 
                    : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
                }`}>
                  <step.icon className="w-5 h-5" />
                  <span className="font-medium text-sm whitespace-nowrap">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className={`w-5 h-5 mx-2 ${
                    currentStep > step.id ? 'text-accent-500' : 'text-neutral-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Composant d'erreur de validation GIE */}
          {validationError && (
            <div className="mb-8">
              <GIEValidationErrorComponent
                error={{ response: { data: validationError } }}
                onRetry={() => handleGIEValidation()}
                onContact={() => window.open('/contact', '_blank')}
              />
            </div>
          )}

          {/* Step 1: GIE Identification */}
          {currentStep === 1 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <Building className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Identification du GIE Affilié</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Code d'identification alphanumérique du GIE *
                  </label>
                  <input
                    type="text"
                    value={gieData.identification}
                    onChange={(e) => {
                      setGieData(prev => ({ ...prev, identification: e.target.value.toUpperCase() }));
                      clearError(); // Effacer les erreurs lors de la saisie
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 font-mono text-lg ${
                      errors.identification ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Ex: 68858062677053a96fa5cb54"
                    disabled={isLoadingGIE || isValidating}
                  />
                  {errors.identification && <p className="text-red-500 text-sm mt-1">{errors.identification}</p>}
                  <p className="text-sm text-neutral-500 mt-1">
                    Saisissez l'ID MongoDB de votre GIE validé
                  </p>
                </div>
                
                {/* Information d'aide */}
                <div className="md:col-span-2 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">GIE Disponibles pour Test</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Utilisez un de ces ID de GIE validés pour tester :
                      </p>
                      <div className="space-y-1 text-sm font-mono">
                        <div className="bg-blue-100 rounded px-2 py-1">
                          <span className="text-blue-800">68858062677053a96fa5cb54</span>
                          <span className="text-blue-600 ml-2">(FEVEO-01-01-01-01-001)</span>
                        </div>
                        <div className="bg-blue-100 rounded px-2 py-1">
                          <span className="text-blue-800">68858063677053a96fa5d2ad</span>
                          <span className="text-blue-600 ml-2">(FEVEO-02-01-01-01-002)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom du GIE *
                  </label>
                  <input
                    type="text"
                    value={gieData.nom}
                    onChange={(e) => setGieData(prev => ({ ...prev, nom: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.nom ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Nom du GIE"
                  />
                  {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Région *
                  </label>
                  <select
                    value={gieData.region}
                    onChange={(e) => setGieData(prev => ({ ...prev, region: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.region ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Sélectionnez la région</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom de la Présidente *
                  </label>
                  <input
                    type="text"
                    value={gieData.presidenteNom}
                    onChange={(e) => setGieData(prev => ({ ...prev, presidenteNom: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.presidenteNom ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Nom complet de la présidente"
                  />
                  {errors.presidenteNom && <p className="text-red-500 text-sm mt-1">{errors.presidenteNom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email de la Présidente *
                  </label>
                  <input
                    type="email"
                    value={gieData.presidenteEmail}
                    onChange={(e) => setGieData(prev => ({ ...prev, presidenteEmail: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.presidenteEmail ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="email@exemple.com"
                  />
                  {errors.presidenteEmail && <p className="text-red-500 text-sm mt-1">{errors.presidenteEmail}</p>}
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button 
                  onClick={handleNext} 
                  disabled={isLoadingGIE || isValidating || !gieData.identification.trim()}
                  className={`px-8 py-3 rounded-lg flex items-center ${
                    isLoadingGIE || isValidating 
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                      : 'btn-accent'
                  }`}
                >
                  {(isLoadingGIE || isValidating) && (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  )}
                  {(isLoadingGIE || isValidating) ? 'Validation en cours...' : 'Valider le GIE'}
                  {!(isLoadingGIE || isValidating) && <ArrowRight className="w-5 h-5 ml-2" />}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Subscription Form */}
          {currentStep === 2 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Fiche de Souscription</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Type d'investissement *
                  </label>
                  <select
                    value={subscriptionData.typeInvestissement}
                    onChange={(e) => setSubscriptionData(prev => ({ ...prev, typeInvestissement: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.typeInvestissement ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Sélectionnez le type</option>
                    {typesInvestissement.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} ({type.min.toLocaleString()} - {type.max.toLocaleString()} FCFA)
                      </option>
                    ))}
                  </select>
                  {errors.typeInvestissement && <p className="text-red-500 text-sm mt-1">{errors.typeInvestissement}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nombre de parts *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={subscriptionData.nombreParts}
                    onChange={(e) => setSubscriptionData(prev => ({ ...prev, nombreParts: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.nombreParts ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Nombre de parts (1 part = 10 000 FCFA)"
                  />
                  {errors.nombreParts && <p className="text-red-500 text-sm mt-1">{errors.nombreParts}</p>}
                  {subscriptionData.nombreParts && (
                    <p className="text-sm text-success-600 mt-1">
                      Montant total: {(subscriptionData.nombreParts * 10000).toLocaleString()} FCFA
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Durée d'investissement
                  </label>
                  <select
                    value={subscriptionData.dureeInvestissement}
                    onChange={(e) => setSubscriptionData(prev => ({ ...prev, dureeInvestissement: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                  >
                    <option value="">Sélectionnez la durée</option>
                    <option value="6">6 mois</option>
                    <option value="12">12 mois</option>
                    <option value="24">24 mois</option>
                    <option value="36">36 mois</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Objectif du projet *
                  </label>
                  <input
                    type="text"
                    value={subscriptionData.objectifProjet}
                    onChange={(e) => setSubscriptionData(prev => ({ ...prev, objectifProjet: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.objectifProjet ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Ex: Développement de la production maraîchère"
                  />
                  {errors.objectifProjet && <p className="text-red-500 text-sm mt-1">{errors.objectifProjet}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description du projet
                  </label>
                  <textarea
                    rows={4}
                    value={subscriptionData.descriptionProjet}
                    onChange={(e) => setSubscriptionData(prev => ({ ...prev, descriptionProjet: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Décrivez votre projet d'investissement..."
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentStep(1)} 
                  className="btn-secondary px-8 py-3"
                >
                  Retour
                </button>
                <button onClick={handleNext} className="btn-accent px-8 py-3">
                  Continuer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Face Verification */}
          {currentStep === 3 && (
            <div className="card text-center">
              <div className="flex items-center justify-center mb-6">
                <Camera className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Vérification Faciale Sécurisée</h3>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-neutral-100 rounded-xl p-8 mb-6">
                  {!faceVerification.isProcessing && !faceVerification.isVerified && (
                    <div>
                      <Camera className="w-24 h-24 text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-600 mb-6">
                        Positionnez votre visage dans le cadre pour la vérification d'identité de la Présidente du GIE
                      </p>
                      <button 
                        onClick={handleFaceVerification}
                        className="btn-accent px-6 py-3"
                      >
                        Démarrer la vérification
                      </button>
                    </div>
                  )}

                  {faceVerification.isProcessing && (
                    <div>
                      <div className="w-24 h-24 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-accent-600 font-medium">Analyse en cours...</p>
                      <p className="text-sm text-neutral-500 mt-2">Veuillez rester immobile</p>
                    </div>
                  )}

                  {faceVerification.isVerified && (
                    <div>
                      <CheckCircle className="w-24 h-24 text-success-500 mx-auto mb-4" />
                      <p className="text-success-600 font-medium mb-2">Vérification réussie !</p>
                      <p className="text-sm text-neutral-600">
                        Confiance: {faceVerification.confidence}%
                      </p>
                    </div>
                  )}

                  {!faceVerification.isProcessing && !faceVerification.isVerified && faceVerification.confidence > 0 && (
                    <div>
                      <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600 font-medium mb-2">Vérification échouée</p>
                      <p className="text-sm text-neutral-600 mb-4">
                        Confiance: {faceVerification.confidence}% (minimum requis: 75%)
                      </p>
                      <button 
                        onClick={handleFaceVerification}
                        className="btn-accent px-6 py-3"
                      >
                        Réessayer
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Sécurité garantie</h4>
                      <p className="text-sm text-blue-700">
                        Vos données biométriques sont chiffrées et ne sont utilisées que pour la vérification d'identité.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentStep(2)} 
                  className="btn-secondary px-8 py-3"
                >
                  Retour
                </button>
                <button 
                  onClick={() => setCurrentStep(4)} 
                  disabled={!faceVerification.isVerified}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    faceVerification.isVerified 
                      ? 'btn-accent' 
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Continuer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Mobile Payment */}
          {currentStep === 4 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <Smartphone className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Paiement Mobile Money</h3>
              </div>

              <div className="bg-success-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-success-800">Montant à payer</h4>
                    <p className="text-2xl font-bold text-success-600">
                      {subscriptionData.montantTotal.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-success-700">
                      {subscriptionData.nombreParts} parts × 10 000 FCFA
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-success-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Opérateur Mobile Money *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {operateurs.map((op) => (
                      <button
                        key={op.code}
                        onClick={() => setPaymentData(prev => ({ ...prev, operateur: op.code }))}
                        className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                          paymentData.operateur === op.code
                            ? 'border-accent-500 bg-accent-50 text-accent-700'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{op.logo}</div>
                        <div className="text-sm font-medium">{op.name}</div>
                      </button>
                    ))}
                  </div>
                  {errors.operateur && <p className="text-red-500 text-sm mt-1">{errors.operateur}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    value={paymentData.numeroTelephone}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, numeroTelephone: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.numeroTelephone ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="+221 XX XXX XX XX"
                  />
                  {errors.numeroTelephone && <p className="text-red-500 text-sm mt-1">{errors.numeroTelephone}</p>}

                  <label className="block text-sm font-medium text-neutral-700 mb-2 mt-4">
                    Code PIN *
                  </label>
                  <div className="relative">
                    <input
                      type={paymentData.showPin ? 'text' : 'password'}
                      value={paymentData.codePin}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, codePin: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 pr-12 ${
                        errors.codePin ? 'border-red-300' : 'border-neutral-300'
                      }`}
                      placeholder="Code PIN"
                      maxLength={4}
                    />
                    <button
                      type="button"
                      onClick={() => setPaymentData(prev => ({ ...prev, showPin: !prev.showPin }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {paymentData.showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.codePin && <p className="text-red-500 text-sm mt-1">{errors.codePin}</p>}
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <Lock className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Paiement sécurisé</h4>
                    <p className="text-sm text-amber-700">
                      Votre paiement est protégé par un chiffrement de niveau bancaire. 
                      Vous recevrez un SMS de confirmation après le paiement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentStep(3)} 
                  className="btn-secondary px-8 py-3"
                >
                  Retour
                </button>
                <button onClick={handlePayment} className="btn-success px-8 py-3">
                  Payer {subscriptionData.montantTotal.toLocaleString()} FCFA
                  <CreditCard className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Wallet Generated */}
          {currentStep === 5 && walletGenerated && (
            <div className="card text-center">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-success-500 mr-3" />
                <h3 className="text-2xl font-bold text-success-600">Wallet GIE Généré avec Succès !</h3>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-primary-500 rounded-xl p-8 text-neutral-50 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xl font-bold mb-2">WALLET GIE AFFILIÉ</h4>
                      <p className="opacity-90">{gieData.nom}</p>
                    </div>
                    <Wallet className="w-12 h-12 opacity-80" />
                  </div>

                  <div className="bg-neutral-50/10 rounded-lg p-4 mb-4">
                    <div className="text-sm opacity-80 mb-1">ID Wallet</div>
                    <div className="font-mono text-lg font-bold">{generateWalletId()}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-neutral-50/10 rounded-lg p-3">
                      <div className="opacity-80">Parts souscrites</div>
                      <div className="font-bold text-lg">{subscriptionData.nombreParts}</div>
                    </div>
                    <div className="bg-neutral-50/10 rounded-lg p-3">
                      <div className="opacity-80">Montant investi</div>
                      <div className="font-bold text-lg">{subscriptionData.montantTotal.toLocaleString()} FCFA</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-neutral-100 rounded-lg p-6">
                    <h5 className="font-semibold text-neutral-900 mb-4">Informations du GIE</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Code GIE:</span>
                        <span className="font-medium">{gieData.identification}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Présidente:</span>
                        <span className="font-medium">{gieData.presidenteNom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Région:</span>
                        <span className="font-medium">{gieData.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Statut:</span>
                        <span className="text-success-600 font-medium">✓ Vérifié</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-100 rounded-lg p-6">
                    <h5 className="font-semibold text-neutral-900 mb-4">Détails Investissement</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Type:</span>
                        <span className="font-medium">{typesInvestissement.find(t => t.value === subscriptionData.typeInvestissement)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Durée:</span>
                        <span className="font-medium">{subscriptionData.dureeInvestissement} mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Objectif:</span>
                        <span className="font-medium">{subscriptionData.objectifProjet}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Date:</span>
                        <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-primary px-6 py-3">
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger le certificat
                  </button>
                  <button className="btn-secondary px-6 py-3">
                    <QrCode className="w-5 h-5 mr-2" />
                    Code QR Wallet
                  </button>
                  <button className="btn-accent px-6 py-3">
                    <Wallet className="w-5 h-5 mr-2" />
                    Accéder au Wallet
                  </button>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-8 text-left">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Accès privé sécurisé</h4>
                      <p className="text-sm text-blue-700">
                        Votre Wallet GIE est maintenant accessible depuis la rubrique "WALLET GIE" avec un accès privé sécurisé. 
                        Seuls les membres autorisés du GIE peuvent y accéder.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;