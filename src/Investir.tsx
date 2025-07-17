import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { 
  TrendingUp, 
  Shield, 
  Target, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  CreditCard
} from 'lucide-react';

const Investir = () => {
  // États simplifiés pour le formulaire d'investissement
  const [currentStep, setCurrentStep] = useState(1);
  const [gieData, setGieData] = useState({
    codeGIE: '',
    presidenteNom: '',
    presidenteEmail: ''
  });
  
  const [subscriptionData, setSubscriptionData] = useState({
    nombreParts: '',
    montantTotal: 0,
    typeInvestissement: ''
  });

  const [selectedPaymentPeriod, setSelectedPaymentPeriod] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentPeriods = [
    { 
      id: 'day1', 
      label: 'Paiement Journalier', 
      description: 'Investissement quotidien',
      amount: 6060,
      period: '1 jour',
      color: 'bg-green-500',
      url: 'https://pay.wave.com/m/M_sn_t3V8_2xeRR6Z/c/sn/?amount=6060'
    },
    { 
      id: 'day10', 
      label: 'Paiement 10 jours', 
      description: 'Investissement pour 10 jours',
      amount: 60600,
      period: '10 jours',
      color: 'bg-blue-500',
      url: 'https://pay.wave.com/m/M_sn_t3V8_2xeRR6Z/c/sn/?amount=60600'
    },
    { 
      id: 'day15', 
      label: 'Paiement 15 jours', 
      description: 'Investissement pour 15 jours',
      amount: 90900,
      period: '15 jours',
      color: 'bg-orange-500',
      url: 'https://pay.wave.com/m/M_sn_t3V8_2xeRR6Z/c/sn/?amount=90900'
    },
    { 
      id: 'day30', 
      label: 'Paiement 30 jours', 
      description: 'Investissement pour 30 jours',
      amount: 181800,
      period: '30 jours',
      color: 'bg-purple-500',
      url: 'https://pay.wave.com/m/M_sn_t3V8_2xeRR6Z/c/sn/?amount=181800'
    }
  ];

  const typesInvestissement = [
    { value: 'production', label: 'Production Agricole', min: 50000, max: 2000000 },
    { value: 'transformation', label: 'Transformation', min: 100000, max: 5000000 },
    { value: 'commerce', label: 'Commerce/Distribution', min: 25000, max: 1000000 },
    { value: 'mixte', label: 'Projet Mixte', min: 75000, max: 3000000 }
  ];

  const advantages = [
    {
      icon: TrendingUp,
      title: 'Rendement Attractif',
      description: 'Des retours sur investissement compétitifs avec une croissance soutenue',
      color: 'text-accent-500'
    },
    {
      icon: Shield,
      title: 'Investissement Sécurisé',
      description: 'Plateforme régulée avec garanties et transparence totale',
      color: 'text-primary-500'
    },
    {
      icon: Target,
      title: 'Impact Social',
      description: 'Contribuez directement à l\'autonomisation des femmes entrepreneures',
      color: 'text-success-500'
    },
    {
      icon: Award,
      title: 'Excellence Reconnue',
      description: 'Plateforme primée par les institutions financières africaines',
      color: 'text-accent-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Code GIE',
      description: 'Saisissez votre code GIE'
    },
    {
      number: '02',
      title: 'Investissement',
      description: 'Investissement journalier avec Wave'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onNavigate={() => {}} />
      
      {/* Hero Section - Explication de l'investissement */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
        
        <div className="relative z-10 container-max mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-accent-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <TrendingUp className="w-5 h-5 text-accent-400 mr-3" />
              <span className="text-accent-400 font-medium">Investir avec FEVEO 2050</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-50 leading-tight mb-6">
              Comment fonctionne
              <span className="block text-accent-400">l'investissement journalier ?</span>
            </h1>
            
            <p className="text-xl text-neutral-200 max-w-4xl mx-auto leading-relaxed">
              FEVEO 2050 révolutionne l'investissement des GIEs de femmes avec un système simple et accessible à tous ses membres affiliés à la plateforme d'investissement économie organique. Cette plateforme permet a chaque GIE d'investir une somme de 
              <strong className="text-accent-400"> 6 060 f.cfa par jour. </strong> Cette somme est constituée d'une épargne investissement de 150 f.cfa par membre .
            </p>
          </div>

          {/* Explication du concept */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Concept principal */}
            <div className="bg-gradient-to-br from-accent-500/20 to-primary-500/20 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mr-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-50">Le Concept</h2>
              </div>
              
              <div className="space-y-4 text-neutral-200">
                <p className="leading-relaxed">
                  <strong className="text-accent-400">6 060 FCFA/jour</strong>  = un investissement quotidien soutenable qui se transforme en force collective massive.
                </p>
                <p className="leading-relaxed">
                 Chaque jour, votre contribution rejoint un fonds d'investissement international sécurisé avec d'autres investisseurs du monde global pour financer des projets concrets menés par des GIEs femmes sénégalaises entrepreneures dans l'économie organique.
                </p>
                <p className="leading-relaxed text-accent-300">
                  💡 <strong>L'idée :</strong> Rendre structurante l'investissement des GIEs de femmes pour la transformation systémique des potentiels économiques territoriaux, à partir d'un coût moins onéreux que l'achat d'un sachet café Touba vendu à 250 f.cfa
                </p>
              </div>
            </div>

            {/* Right: Mécanisme */}
            <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mr-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-50">Le Mécanisme</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-neutral-50 mb-1">Investissement quotidien</h4>
                    <p className="text-sm text-neutral-300">6 060 FCFA transférés automatiquement dans le compte Wave de FEVEO 2050, à partir du N° PAYMASTER Wave du GIE, indiqué dans la fiche d'adhésion et d'affiliation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-neutral-50 mb-1">Financement de projets</h4>
                    <p className="text-sm text-neutral-300">L'investissement des GIEs FEVEO contribue directement aux leviers financiers d'ordre international qui assurent le financement du projet global économie organique FEVEO 2050 porté par les GIEs de femmes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-neutral-50 mb-1">Retour sur investissement</h4>
                    <p className="text-sm text-neutral-300">Rendements attractifs + impact social mesurable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculs et exemples */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20 mb-16">
            <h2 className="text-2xl font-bold text-neutral-50 text-center mb-8">Vos options d'investissement</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-xl border border-neutral-50/10">
                <div className="text-3xl font-bold text-accent-400 mb-2">6 060</div>
                <div className="text-neutral-300 text-sm mb-2">FCFA/jour</div>
                <div className="text-xs text-neutral-400">Paiement quotidien</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-neutral-50/10">
                <div className="text-3xl font-bold text-blue-400 mb-2">60 600</div>
                <div className="text-neutral-300 text-sm mb-2">FCFA/10 jours</div>
                <div className="text-xs text-neutral-400">Plus pratique</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-neutral-50/10">
                <div className="text-3xl font-bold text-orange-400 mb-2">90 900</div>
                <div className="text-neutral-300 text-sm mb-2">FCFA/15 jours</div>
                <div className="text-xs text-neutral-400">Équilibré</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-neutral-50/10">
                <div className="text-3xl font-bold text-purple-400 mb-2">181 800</div>
                <div className="text-neutral-300 text-sm mb-2">FCFA/mois</div>
                <div className="text-xs text-neutral-400">Plus économique</div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-neutral-300 text-sm">
                💰 <strong>Exemple :</strong> En 1 an = 2 211 900 FCFA investis = 365 000 femmes impactées
              </p>
            </div>
          </div>

          {/* Impact et garanties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-success-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-50 mb-3">Impact Direct</h3>
              <p className="text-neutral-300 text-sm">
                Chaque FCFA investi participe directement à la consolidation et à l'épanouissement économique et financier du pilier de la famille sénégalaise, la femme. Au moins 691 250 familles % seront impactés.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-50 mb-3">Sécurisé</h3>
              <p className="text-neutral-300 text-sm">
                Plateforme régulée, paiements sécurisés Wave, transparence totale sur l'utilisation des fonds
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-50 mb-3">Rentable</h3>
              <p className="text-neutral-300 text-sm">
                Rendements attractifs + impact social + contribution à l'économie africaine
              </p>
            </div>
          </div>

          {/* CTA Final */}
          {/* <div className="text-center">
            <div className="bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Prêt à commencer ?</h3>
              <p className="text-white/90 mb-6">
                Rejoignez dès aujourd'hui les investisseurs qui transforment l'Afrique, 6 060 FCFA à la fois.
              </p>
              <button 
                onClick={() => document.querySelector('#investment-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transform transition-all duration-200 group"
              >
                Commencer mon investissement
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div> */}
        </div>
      </section>

      {/* How it Works Section */}
      {/* <section className="py-20 bg-neutral-50">
        <div className="container-max mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Un processus simple et sécurisé pour commencer votre parcours d'investissement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-xl p-6 border border-neutral-200 hover:border-accent-300 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent-500 text-neutral-50 rounded-full font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-neutral-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Investment Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container-max mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-accent-500/10 rounded-full px-4 py-2 mb-4">
              <Target className="w-4 h-4 text-accent-600 mr-2" />
              <span className="text-accent-600 text-sm font-medium">Investir maintenant</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Investissement simplifié
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Un processus d'investissement en 2 étapes simples. Pas de complications, juste l'essentiel.
            </p>
          </div>

          {/* Simplified Investment Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
              
              {/* Progress Indicator */}
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6">
                {/* <div className="flex items-center justify-between max-w-md mx-auto">
                  {[1, 2].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        (currentStep === 1 && step === 1) || (currentStep === 3 && step === 2) ? 'bg-white text-primary-600' : 'bg-white/20 text-white'
                      }`}>
                        {step}
                      </div>
                      {step < 2 && (
                        <div className={`w-16 h-1 mx-3 rounded ${
                          currentStep === 3 ? 'bg-white' : 'bg-white/20'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div> */}
                <div className="text-center mt-4">
                  <h3 className="text-white text-lg font-semibold">
                    {currentStep === 1 && "Code GIE"}
                    {currentStep === 3 && "Investissement journalier"}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                {/* Step 1: GIE Code and Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">Code GIE et informations</h3>
                      <p className="text-neutral-600">Saisissez votre code GIE pour continuer</p>
                    </div>

                    <div className="space-y-6 max-w-md mx-auto">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Code GIE *
                        </label>
                        <input
                          type="text"
                          value={gieData.codeGIE}
                          onChange={(e) => setGieData(prev => ({ ...prev, codeGIE: e.target.value.toUpperCase() }))}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors text-center font-mono text-lg ${
                            errors.codeGIE 
                              ? 'border-red-300' 
                              : gieData.codeGIE.length >= 3 
                                ? 'border-green-300' 
                                : 'border-neutral-300'
                          }`}
                          placeholder="Ex: GIE2024001"
                          maxLength={15}
                        />
                        {errors.codeGIE && <p className="text-red-500 text-sm mt-1">{errors.codeGIE}</p>}
                        {!errors.codeGIE && gieData.codeGIE.length >= 3 && (
                          <p className="text-green-600 text-sm mt-1">✓ Code GIE valide</p>
                        )}
                      </div>

                     
                    </div>

                    <div className="flex justify-center pt-6">
                      <button
                        onClick={() => {
                          const newErrors: Record<string, string> = {};
                          
                          if (!gieData.codeGIE.trim()) {
                            newErrors.codeGIE = 'Code GIE requis';
                          } else if (gieData.codeGIE.trim().length < 3) {
                            newErrors.codeGIE = 'Le code GIE doit contenir au moins 3 caractères';
                          }
                          

                          if (Object.keys(newErrors).length === 0) {
                            setCurrentStep(3);
                            setErrors({});
                          } else {
                            setErrors(newErrors);
                          }
                        }}
                        className="btn-accent px-8 py-3 text-lg"
                      >
                        Continuer
                      </button>
                    </div>
                  </div>
                )}

               

                {/* Step 3: Payment Period Selection */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">Commencez votre investissement journalier</h3>
                      <p className="text-neutral-600">Investissement quotidien de 6 060 FCFA avec Wave</p>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200 mb-8">
                      <h4 className="text-lg font-bold text-neutral-900 mb-4">Récapitulatif de votre investissement</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Code GIE:</span>
                            <span className="font-mono font-bold">{gieData.codeGIE}</span>
                          </div>
                         
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Investissement:</span>
                            <span className="font-medium">Journalier</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-600">Montant journalier:</span>
                            <span className="text-2xl font-bold text-accent-600">
                              6 060 FCFA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Period Options */}
                    <div>
                      <h4 className="text-xl font-bold text-neutral-900 mb-8 text-center">Choisissez votre période d'investissement</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
                        {paymentPeriods.map((period) => {
                          return (
                            <button
                              key={period.id}
                              onClick={() => setSelectedPaymentPeriod(period.id)}
                              className={`p-6 border-2 rounded-xl text-center transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                                selectedPaymentPeriod === period.id
                                  ? 'border-accent-500 bg-accent-50 shadow-lg scale-105'
                                  : 'border-neutral-200 hover:border-accent-300'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full ${period.color} mx-auto mb-3`}></div>
                              <h5 className="font-bold text-neutral-900 mb-2 text-lg">{period.label}</h5>
                              <p className="text-neutral-600 mb-3 text-sm">{period.description}</p>
                              
                              <div className="text-2xl font-bold text-accent-600 mb-1">
                                {period.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-neutral-500 mb-3">
                                FCFA • {period.period}
                              </div>
                              
                              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-xs text-green-800 font-medium mb-1">
                                  💰 {period.id === 'day1' ? 'Plus flexible' : period.id === 'day30' ? 'Plus économique' : 'Équilibré'}
                                </div>
                                <div className="text-xs text-green-700">
                                  {period.id === 'day1' && 'Paiement quotidien'}
                                  {period.id === 'day10' && 'Bon compromis'}
                                  {period.id === 'day15' && 'Paiement bimensuel'}
                                  {period.id === 'day30' && 'Paiement mensuel'}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="btn-secondary px-6 py-3"
                      >
                        Retour
                      </button>
                      <button
                        onClick={() => {
                          if (!selectedPaymentPeriod) {
                            setErrors({ paymentPeriod: 'Veuillez sélectionner le mode d\'investissement' });
                            return;
                          }

                          const selectedPeriod = paymentPeriods.find(p => p.id === selectedPaymentPeriod);
                          
                          // Rediriger vers le lien de paiement Wave
                          const paymentUrl = selectedPeriod.url;
                          
                          const message = `🎉 Redirection vers le paiement !\n\nDétails de votre investissement :\n• Code GIE: ${gieData.codeGIE}\n• Montant: ${selectedPeriod.amount.toLocaleString()} FCFA\n• Type: ${selectedPeriod.label}\n\nVous allez être redirigé vers Wave pour effectuer le paiement.`;
                          
                          alert(message);
                          
                          // Ouvrir le lien Wave dans un nouvel onglet
                          window.open(paymentUrl, '_blank');
                          
                          // Reset du formulaire après redirection
                          setTimeout(() => {
                            setCurrentStep(1);
                            setGieData({ codeGIE: '', presidenteNom: '', presidenteEmail: '' });
                            setSubscriptionData({ nombreParts: '', typeInvestissement: '', montantTotal: 0 });
                            setSelectedPaymentPeriod('');
                            setErrors({});
                          }, 2000);
                        }}
                        disabled={!selectedPaymentPeriod}
                        className={`px-8 py-3 text-lg font-semibold ${
                          selectedPaymentPeriod 
                            ? 'btn-success' 
                            : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payer avec Wave
                      </button>
                    </div>
                    
                    {errors.paymentPeriod && (
                      <p className="text-red-500 text-center mt-4">{errors.paymentPeriod}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="mt-16 text-center">
            <p className="text-neutral-500 mb-6">Processus sécurisé et transparent</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {[
                { name: 'Paiement sécurisé', icon: Shield },
                { name: 'Régulé BCEAO', icon: CheckCircle },
                { name: 'Support 24/7', icon: Award }
              ].map((trust, index) => (
                <div key={index} className="flex items-center gap-2">
                  <trust.icon className="w-5 h-5 text-neutral-400" />
                  <span className="text-sm text-neutral-500 font-medium">{trust.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Investir;
