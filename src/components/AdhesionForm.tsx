import React, { useState, useEffect } from 'react';
import { Building, FileText, MapPin, User, Phone, Calendar, CreditCard, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { gieService } from '../services/gieService';
import { adhesionService } from '../services/adhesionService';
import { 
  SENEGAL_GEOGRAPHIC_DATA, 
  getRegions, 
  getDepartements, 
  getArrondissements, 
  getCommunes,
  validateGeographicLocation
} from '../data/senegalGeography';

interface Departement {
  nom: string;
  arrondissements: { [key: string]: string };
}

interface Region {
  nom: string;
  departements: { [key: string]: Departement };
}

interface FormData {
  // Identification GIE
  numeroAdhesion: string;
  codeRegion: string;
  codeDepartement: string;
  codeArrondissement: string;
  codeCommune: string;
  numeroListe: string;
  commune: string;
  arrondissement: string;
  departement: string;
  region: string;
  
  // Immatriculation
  immatricule: boolean;
  numeroRegistre: string;
  
  // Présidente
  presidenteNom: string;
  presidentePrenom: string;
  dateNaissance: string;
  cinNumero: string;
  cinDelivrance: string;
  cinValidite: string;
  telephone: string;
  
  // Activités
  activites: string[];
  autresActivites: string;
  agriculture: boolean;
  elevage: boolean;
  transformation: boolean;
  commerceDistribution: boolean;
  
  // Coordonnateur
  coordinateurNom: string;
  coordinateurMatricule: string;
  
  // Signatures
  dateSignature: string;
}

interface FormErrors {
  codeRegion?: string;
  codeDepartement?: string;
  codeArrondissement?: string;
  numeroListe?: string;
  presidenteNom?: string;
  presidentePrenom?: string;
  dateNaissance?: string;
  cinNumero?: string;
  telephone?: string;
  activites?: string;
}

interface AdhesionFormProps {
  onBack: () => void;
}

const AdhesionForm: React.FC<AdhesionFormProps> = ({ onBack }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // États pour les données géographiques
  const [regions, setRegions] = useState<any[]>([]);
  const [departements, setDepartements] = useState<any[]>([]);
  const [arrondissements, setArrondissements] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    // Identification GIE
    numeroAdhesion: '',
    codeRegion: '',
    codeDepartement: '',
    codeArrondissement: '',
    codeCommune: '',
    numeroListe: '',
    commune: '',
    arrondissement: '',
    departement: '',
    region: '',
    
    // Immatriculation
    immatricule: false,
    numeroRegistre: '',
    
    // Présidente
    presidenteNom: '',
    presidentePrenom: '',
    dateNaissance: '',
    cinNumero: '',
    cinDelivrance: '',
    cinValidite: '',
    telephone: '',
    
    // Activités
    activites: [],
    autresActivites: '',
    agriculture: false,
    elevage: false,
    transformation: false,
    commerceDistribution: false,
    
    // Coordonnateur
    coordinateurNom: '',
    coordinateurMatricule: '',
    
    // Signatures
    dateSignature: new Date().toISOString().split('T')[0]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  // Initialiser les données géographiques
  useEffect(() => {
    setRegions(getRegions());
  }, []);

  // Gestion des changements géographiques
  const handleRegionChange = (regionCode: string) => {
    const regionData = SENEGAL_GEOGRAPHIC_DATA[regionCode];
    setFormData(prev => ({
      ...prev,
      codeRegion: regionCode,
      region: regionData?.nom || '',
      codeDepartement: '',
      departement: '',
      codeArrondissement: '',
      arrondissement: '',
      codeCommune: '',
      commune: ''
    }));
    
    setDepartements(getDepartements(regionCode));
    setArrondissements([]);
    setCommunes([]);
  };

  const handleDepartementChange = (departementCode: string) => {
    const departementData = SENEGAL_GEOGRAPHIC_DATA[formData.codeRegion]?.departements[departementCode];
    setFormData(prev => ({
      ...prev,
      codeDepartement: departementCode,
      departement: departementData?.nom || '',
      codeArrondissement: '',
      arrondissement: '',
      codeCommune: '',
      commune: ''
    }));
    
    setArrondissements(getArrondissements(formData.codeRegion, departementCode));
    setCommunes([]);
  };

  const handleArrondissementChange = (arrondissementCode: string) => {
    const arrondissementData = SENEGAL_GEOGRAPHIC_DATA[formData.codeRegion]?.departements[formData.codeDepartement]?.arrondissements[arrondissementCode];
    setFormData(prev => ({
      ...prev,
      codeArrondissement: arrondissementCode,
      arrondissement: arrondissementData?.nom || '',
      codeCommune: '',
      commune: ''
    }));
    
    setCommunes(getCommunes(formData.codeRegion, formData.codeDepartement, arrondissementCode));
  };

  const handleCommuneChange = (communeNom: string) => {
    setFormData(prev => ({
      ...prev,
      commune: communeNom,
      codeCommune: `${prev.codeArrondissement}-${communeNom.replace(/\s+/g, '-').toUpperCase()}`
    }));
  };

  const generateGIECode = () => {
    if (formData.codeRegion && formData.codeDepartement && formData.codeArrondissement && formData.codeCommune && formData.numeroListe) {
      return `FEVEO${formData.codeRegion}${formData.codeDepartement}${formData.codeArrondissement}${formData.codeCommune}${formData.numeroListe.padStart(3, '0')}`;
    }
    return '';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.codeRegion) newErrors.codeRegion = 'Région requise';
        if (!formData.codeDepartement) newErrors.codeDepartement = 'Département requis';
        if (!formData.codeArrondissement) newErrors.codeArrondissement = 'Arrondissement requis';
        if (!formData.numeroListe) newErrors.numeroListe = 'Numéro de liste requis';
        break;
      case 2:
        if (!formData.presidenteNom.trim()) newErrors.presidenteNom = 'Nom requis';
        if (!formData.presidentePrenom.trim()) newErrors.presidentePrenom = 'Prénom requis';
        if (!formData.dateNaissance) newErrors.dateNaissance = 'Date de naissance requise';
        if (!formData.cinNumero.trim()) newErrors.cinNumero = 'Numéro CIN requis';
        if (!formData.telephone.trim()) newErrors.telephone = 'Téléphone requis';
        break;
      case 3:
        if (!formData.agriculture && !formData.elevage && !formData.transformation && !formData.commerceDistribution) {
          newErrors.activites = 'Au moins une activité doit être sélectionnée';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setSubmitError('Vous devez être connecté pour soumettre une adhésion');
      return;
    }

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // D'abord créer le GIE
      const gieData = {
        nomGIE: `GIE ${formData.presidenteNom}`, // Vous pouvez ajuster la logique de nommage
        presidenteNom: formData.presidenteNom,
        presidentePrenom: formData.presidentePrenom,
        adresse: {
          region: formData.region,
          departement: formData.departement,
          arrondissement: formData.arrondissement,
          commune: formData.commune,
        },
        contact: {
          telephone: formData.telephone,
        },
        activites: formData.activites,
        autresActivites: formData.autresActivites,
        nomCoordinateur: formData.coordinateurNom,
        matriculeCoordinateur: formData.coordinateurMatricule,
        immatricule: formData.immatricule,
        numeroRegistre: formData.numeroRegistre,
      };

      const gieResponse = await gieService.createGIE(gieData);
      
      if (!gieResponse.success || !gieResponse.data) {
        throw new Error(gieResponse.message || 'Erreur lors de la création du GIE');
      }

      // Ensuite créer l'adhésion
      const adhesionData = {
        numeroAdhesion: formData.numeroAdhesion,
        localisation: {
          region: formData.region,
          departement: formData.departement,
          arrondissement: formData.arrondissement,
          commune: formData.commune,
          codeRegion: formData.codeRegion,
          codeDepartement: formData.codeDepartement,
          codeArrondissement: formData.codeArrondissement,
          codeCommune: formData.codeCommune,
          numeroListe: formData.numeroListe,
        },
        immatriculation: {
          immatricule: formData.immatricule,
          numeroRegistre: formData.numeroRegistre,
        },
        presidente: {
          nom: formData.presidenteNom,
          prenom: formData.presidentePrenom,
          dateNaissance: formData.dateNaissance,
          cin: {
            numero: formData.cinNumero,
            dateDelivrance: formData.cinDelivrance,
            dateValidite: formData.cinValidite,
          },
          telephone: formData.telephone,
        },
        activites: {
          liste: formData.activites,
          autres: formData.autresActivites,
          secteurs: {
            agriculture: formData.agriculture,
            elevage: formData.elevage,
            transformation: formData.transformation,
            commerceDistribution: formData.commerceDistribution,
          },
        },
        coordinateur: {
          nom: formData.coordinateurNom,
          matricule: formData.coordinateurMatricule,
        },
        dateSignature: formData.dateSignature,
      };

      const adhesionResponse = await adhesionService.createAdhesion(
        gieResponse.data._id,
        adhesionData
      );

      if (adhesionResponse.success) {
        setSubmitSuccess(true);
        console.log('Adhésion créée avec succès:', adhesionResponse.data);
      } else {
        throw new Error(adhesionResponse.message || 'Erreur lors de la création de l\'adhésion');
      }
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      setSubmitError(error.message || 'Erreur lors de la soumission du formulaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Localisation GIE', icon: MapPin },
    { id: 2, title: 'Présidente', icon: User },
    { id: 3, title: 'Activités', icon: Building },
    { id: 4, title: 'Finalisation', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-neutral-100 py-8">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-neutral-600 hover:text-accent-500 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Demande d'Adhésion FEVEO 2050</h1>
            <p className="text-neutral-600">Plateforme d'investissement économie organique</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-3" />
              <div>
                <h3 className="font-semibold">Demande soumise avec succès !</h3>
                <p className="text-sm mt-1">
                  Votre demande d'adhésion a été enregistrée. Vous recevrez une confirmation par email.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <h3 className="font-semibold">Erreur lors de la soumission</h3>
            <p className="text-sm mt-1">{submitError}</p>
          </div>
        )}

        {/* Authentication Warning */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg mb-6">
            <h3 className="font-semibold">Connexion requise</h3>
            <p className="text-sm mt-1">
              Vous devez être connecté pour soumettre une demande d'adhésion.
            </p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-accent-500 text-neutral-50' 
                    : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
                }`}>
                  <step.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-accent-500' : 'bg-neutral-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Localisation */}
          {currentStep === 1 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <MapPin className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Localisation du GIE</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Région *
                  </label>
                  <select
                    value={formData.codeRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.codeRegion ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Sélectionnez la région</option>
                    {regions.map((region) => (
                      <option key={region.code} value={region.code}>{region.code} - {region.nom}</option>
                    ))}
                  </select>
                  {errors.codeRegion && <p className="text-red-500 text-sm mt-1">{errors.codeRegion}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Département *
                  </label>
                  <select
                    value={formData.codeDepartement}
                    onChange={(e) => handleDepartementChange(e.target.value)}
                    disabled={!formData.codeRegion}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.codeDepartement ? 'border-red-300' : 'border-neutral-300'
                    } ${!formData.codeRegion ? 'bg-neutral-100' : ''}`}
                  >
                    <option value="">Sélectionnez le département</option>
                    {departements.map((dept) => (
                      <option key={dept.code} value={dept.code}>{dept.code} - {dept.nom}</option>
                    ))}
                  </select>
                  {errors.codeDepartement && <p className="text-red-500 text-sm mt-1">{errors.codeDepartement}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Arrondissement *
                  </label>
                  <select
                    value={formData.codeArrondissement}
                    onChange={(e) => handleArrondissementChange(e.target.value)}
                    disabled={!formData.codeDepartement}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.codeArrondissement ? 'border-red-300' : 'border-neutral-300'
                    } ${!formData.codeDepartement ? 'bg-neutral-100' : ''}`}
                  >
                    <option value="">Sélectionnez l'arrondissement</option>
                    {arrondissements.map((arr) => (
                      <option key={arr.code} value={arr.code}>{arr.code} - {arr.nom}</option>
                    ))}
                  </select>
                  {errors.codeArrondissement && <p className="text-red-500 text-sm mt-1">{errors.codeArrondissement}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Commune
                  </label>
                  <select
                    value={formData.commune}
                    onChange={(e) => handleCommuneChange(e.target.value)}
                    disabled={!formData.codeArrondissement}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      !formData.codeArrondissement ? 'bg-neutral-100' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Sélectionnez la commune</option>
                    {communes.map((commune, index) => (
                      <option key={index} value={commune.nom}>{commune.nom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Numéro de liste d'adhésion *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formData.numeroListe}
                    onChange={(e) => handleInputChange('numeroListe', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.numeroListe ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Numéro d'ordre dans la commune"
                  />
                  {errors.numeroListe && <p className="text-red-500 text-sm mt-1">{errors.numeroListe}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom de la commune
                  </label>
                  <input
                    type="text"
                    value={formData.commune}
                    onChange={(e) => handleInputChange('commune', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Nom de la commune"
                  />
                </div>
              </div>

              {/* Code GIE généré */}
              {generateGIECode() && (
                <div className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200">
                  <h4 className="font-semibold text-accent-800 mb-2">Code GIE généré :</h4>
                  <p className="text-2xl font-mono font-bold text-accent-600">{generateGIECode()}</p>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button onClick={handleNext} className="btn-accent px-8 py-3">
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Présidente */}
          {currentStep === 2 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <User className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Informations de la Présidente</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.presidenteNom}
                    onChange={(e) => handleInputChange('presidenteNom', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.presidenteNom ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Nom de famille"
                  />
                  {errors.presidenteNom && <p className="text-red-500 text-sm mt-1">{errors.presidenteNom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.presidentePrenom}
                    onChange={(e) => handleInputChange('presidentePrenom', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.presidentePrenom ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Prénom(s)"
                  />
                  {errors.presidentePrenom && <p className="text-red-500 text-sm mt-1">{errors.presidentePrenom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.dateNaissance ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  />
                  {errors.dateNaissance && <p className="text-red-500 text-sm mt-1">{errors.dateNaissance}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Numéro CIN *
                  </label>
                  <input
                    type="text"
                    value={formData.cinNumero}
                    onChange={(e) => handleInputChange('cinNumero', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.cinNumero ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Numéro de la carte d'identité"
                  />
                  {errors.cinNumero && <p className="text-red-500 text-sm mt-1">{errors.cinNumero}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date de délivrance CIN
                  </label>
                  <input
                    type="date"
                    value={formData.cinDelivrance}
                    onChange={(e) => handleInputChange('cinDelivrance', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date de validité CIN
                  </label>
                  <input
                    type="date"
                    value={formData.cinValidite}
                    onChange={(e) => handleInputChange('cinValidite', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Téléphone et PAYMASTER *
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.telephone ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="+221 XX XXX XX XX"
                  />
                  {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                </div>
              </div>

              {/* Immatriculation */}
              <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-semibold text-neutral-900 mb-4">Immatriculation au Registre de Commerce</h4>
                <div className="flex items-center space-x-6 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="immatriculation"
                      checked={formData.immatricule}
                      onChange={() => handleInputChange('immatricule', true)}
                      className="mr-2"
                    />
                    Immatriculé
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="immatriculation"
                      checked={!formData.immatricule}
                      onChange={() => handleInputChange('immatricule', false)}
                      className="mr-2"
                    />
                    Non immatriculé
                  </label>
                </div>
                {formData.immatricule && (
                  <input
                    type="text"
                    value={formData.numeroRegistre}
                    onChange={(e) => handleInputChange('numeroRegistre', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Numéro de registre de commerce"
                  />
                )}
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
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Activités */}
          {currentStep === 3 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <Building className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Activités du GIE</h3>
              </div>

              <p className="text-neutral-600 mb-6">
                Sélectionnez les activités dans lesquelles votre GIE souhaite s'engager :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.agriculture}
                    onChange={(e) => handleInputChange('agriculture', e.target.checked)}
                    className="mr-4 w-5 h-5 text-accent-500"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Agriculture</h4>
                    <p className="text-sm text-neutral-600">Production agricole et maraîchère</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.elevage}
                    onChange={(e) => handleInputChange('elevage', e.target.checked)}
                    className="mr-4 w-5 h-5 text-accent-500"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Élevage</h4>
                    <p className="text-sm text-neutral-600">Élevage de bétail et volaille</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.transformation}
                    onChange={(e) => handleInputChange('transformation', e.target.checked)}
                    className="mr-4 w-5 h-5 text-accent-500"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Transformation</h4>
                    <p className="text-sm text-neutral-600">Transformation des produits agricoles</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.commerceDistribution}
                    onChange={(e) => handleInputChange('commerceDistribution', e.target.checked)}
                    className="mr-4 w-5 h-5 text-accent-500"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Commerce et Distribution</h4>
                    <p className="text-sm text-neutral-600">Vente et distribution de produits</p>
                  </div>
                </label>
              </div>

              {errors.activites && <p className="text-red-500 text-sm mt-4">{errors.activites}</p>}

              {/* Coordonnateur */}
              <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-semibold text-neutral-900 mb-4">Coordonnateur d'enrôlement</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.coordinateurNom}
                    onChange={(e) => handleInputChange('coordinateurNom', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Nom du coordonnateur"
                  />
                  <input
                    type="text"
                    value={formData.coordinateurMatricule}
                    onChange={(e) => handleInputChange('coordinateurMatricule', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Matricule (C.ENR.XXX)"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentStep(2)} 
                  className="btn-secondary px-8 py-3"
                >
                  Retour
                </button>
                <button onClick={handleNext} className="btn-accent px-8 py-3">
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Finalisation */}
          {currentStep === 4 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Finalisation de la demande</h3>
              </div>

              {/* Récapitulatif */}
              <div className="bg-neutral-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-neutral-900 mb-4">Récapitulatif de la demande</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Code GIE</h5>
                    <p className="text-lg font-mono font-bold text-accent-600">{generateGIECode()}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Localisation</h5>
                    <p className="text-neutral-900">
                      {formData.commune && `${formData.commune}, `}
                      {formData.arrondissement && `${formData.arrondissement}, `}
                      {formData.departement && `${formData.departement}, `}
                      {formData.region}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Présidente</h5>
                    <p className="text-neutral-900">{formData.presidentePrenom} {formData.presidenteNom}</p>
                    <p className="text-sm text-neutral-600">{formData.telephone}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Activités</h5>
                    <div className="flex flex-wrap gap-2">
                      {formData.agriculture && <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-sm">Agriculture</span>}
                      {formData.elevage && <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-sm">Élevage</span>}
                      {formData.transformation && <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-sm">Transformation</span>}
                      {formData.commerceDistribution && <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-sm">Commerce</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frais */}
              <div className="bg-accent-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-accent-800 mb-4">Frais d'adhésion</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between items-center">
                    <span className="text-accent-700">Droits d'adhésion :</span>
                    <span className="font-bold text-accent-800">20 000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-accent-700">Actions d'investissement :</span>
                    <span className="font-bold text-accent-800">60 000 FCFA</span>
                  </div>
                  <div className="md:col-span-2 border-t border-accent-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-accent-800">Total :</span>
                      <span className="text-2xl font-bold text-accent-800">80 000 FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date de signature */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date de signature
                </label>
                <input
                  type="date"
                  value={formData.dateSignature}
                  onChange={(e) => handleInputChange('dateSignature', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                />
              </div>

              {/* Signatures */}
              <div className="bg-neutral-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-neutral-900 mb-4">Signatures requises</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-neutral-500 text-sm">Signature Présidente</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-700">Présidente</p>
                  </div>
                  <div className="text-center">
                    <div className="h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-neutral-500 text-sm">Signature Secrétaire</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-700">Secrétaire Générale</p>
                  </div>
                  <div className="text-center">
                    <div className="h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-neutral-500 text-sm">Signature Trésorière</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-700">Trésorière</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setCurrentStep(3)} 
                  className="btn-secondary px-8 py-3"
                >
                  Retour
                </button>
                <div className="flex space-x-4">
                  <button className="btn-secondary px-6 py-3">
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger PDF
                  </button>
                  <button onClick={handleSubmit} 
                    className="btn-success px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Soumission en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Soumettre la demande
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdhesionForm;