import React, { useState } from 'react';
import { Users, FileText, CreditCard, Check, ArrowRight } from 'lucide-react';
import AdhesionForm from './AdhesionForm';

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  region: string;
  secteur: string;
}

interface FormErrors {
  nom?: string;
  email?: string;
  telephone?: string;
  region?: string;
  secteur?: string;
}

const AdhesionSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    email: '',
    telephone: '',
    region: '',
    secteur: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  if (showForm) {
    return <AdhesionForm onBack={() => setShowForm(false)} />;
  }

  const steps = [
    {
      icon: Users,
      title: 'Constitution GIE',
      description: 'Formez votre Groupement d\'Intérêt Économique avec au minimum 5 membres',
      color: 'bg-primary-500'
    },
    {
      icon: FileText,
      title: 'Fiche d\'adhésion',
      description: 'Complétez votre dossier d\'adhésion avec les documents requis',
      color: 'bg-accent-500'
    },
    {
      icon: CreditCard,
      title: 'Paiement 20 000 FCFA',
      description: 'Réglez les frais d\'adhésion pour finaliser votre inscription',
      color: 'bg-success-500'
    }
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

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.region) newErrors.region = 'La région est requise';
    if (!formData.secteur) newErrors.secteur = 'Le secteur est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Formulaire soumis:', formData);
      // Ici, vous ajouteriez la logique de soumission
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id="adherer" className="py-20 bg-neutral-50">
      <div className="container-max section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Rejoignez-nous en
            <span className="block text-accent-500">3 étapes simples</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Un processus d'adhésion simplifié pour vous accompagner dans votre parcours entrepreneurial
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="card text-center hover:scale-105 transition-all duration-300">
                <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="w-8 h-8 text-neutral-50" />
                </div>
                
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-neutral-50 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                <h3 className="text-xl font-bold text-neutral-900 mb-4">{step.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-neutral-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Commencez votre adhésion</h3>
              <p className="text-neutral-600">Remplissez ce formulaire pour démarrer le processus</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom du GIE *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.nom ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Nom de votre GIE"
                  />
                  {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.email ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Téléphone *
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

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Région *
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.region ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Sélectionnez votre région</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Secteur d'activité *
                </label>
                <select
                  value={formData.secteur}
                  onChange={(e) => handleInputChange('secteur', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                    errors.secteur ? 'border-red-300' : 'border-neutral-300'
                  }`}
                >
                  <option value="">Sélectionnez votre secteur</option>
                  {secteurs.map((secteur) => (
                    <option key={secteur} value={secteur}>{secteur}</option>
                  ))}
                </select>
                {errors.secteur && <p className="text-red-500 text-sm mt-1">{errors.secteur}</p>}
              </div>

              <div className="flex items-center space-x-3 p-4 bg-success-50 rounded-lg">
                <Check className="w-5 h-5 text-success-500 flex-shrink-0" />
                <p className="text-sm text-success-700">
                  En soumettant ce formulaire, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 btn-secondary text-lg py-4 hover:scale-105 transform transition-all duration-200"
                >
                  Pré-inscription rapide
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="flex-1 btn-accent text-lg py-4 hover:scale-105 transform transition-all duration-200"
                >
                  Formulaire complet d'adhésion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdhesionSection;