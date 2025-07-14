import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InvestmentSection from './components/InvestmentSection';
import { TrendingUp, Shield, Target, Award, ArrowRight, CheckCircle } from 'lucide-react';

const Investir = () => {
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
      title: 'Inscription',
      description: 'Créez votre compte investisseur en quelques minutes'
    },
    {
      number: '02',
      title: 'Vérification',
      description: 'Validation de votre profil et de vos documents'
    },
    {
      number: '03',
      title: 'Investissement',
      description: 'Choisissez vos parts et effectuez votre premier investissement'
    },
    {
      number: '04',
      title: 'Suivi',
      description: 'Suivez vos investissements via votre tableau de bord'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onNavigate={() => {}} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
        
        <div className="relative z-10 container-max mx-auto px-6 py-20 flex items-center min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-accent-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <TrendingUp className="w-4 h-4 text-accent-400 mr-2" />
                <span className="text-accent-400 text-sm font-medium">Investissement Premium</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-50 leading-tight mb-6">
                Investir pour
                <span className="block text-accent-400">l'avenir de l'Afrique</span>
              </h1>
              
              <p className="text-xl text-neutral-200 mb-8 max-w-2xl">
                Rejoignez la révolution économique ! Investissez dans FEVEO 2050 et participez à l'autonomisation de 365 000 femmes entrepreneures africaines.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="btn-accent text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200 group">
                  Commencer à investir
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn-secondary bg-neutral-50/10 border-neutral-50/20 text-neutral-50 hover:bg-neutral-50/20 text-lg px-8 py-4">
                  Découvrir les projets
                </button>
              </div>
              
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">12%</div>
                  <div className="text-sm text-neutral-300">Rendement annuel</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-400">2.5M€</div>
                  <div className="text-sm text-neutral-300">Déjà investis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">500+</div>
                  <div className="text-sm text-neutral-300">Investisseurs</div>
                </div>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-accent-500/20 to-primary-500/20 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent rounded-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-neutral-50 mb-6">Pourquoi investir avec nous ?</h3>
                  <div className="space-y-4">
                    {advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className={`w-10 h-10 rounded-lg bg-neutral-50/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <advantage.icon className={`w-5 h-5 ${advantage.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-50 mb-1">{advantage.title}</h4>
                          <p className="text-sm text-neutral-300">{advantage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-neutral-50">
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
      </section>

      {/* Investment Section */}
      <section className="py-20 bg-white">
        <div className="container-max mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Commencez votre investissement
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Remplissez le formulaire ci-dessous pour démarrer votre parcours d'investissement
            </p>
          </div>
          <InvestmentSection />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-neutral-900">
        <div className="container-max mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-neutral-50 mb-4">
              Ils nous font confiance
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-center p-6 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors">
                <div className="w-24 h-12 bg-neutral-700 rounded flex items-center justify-center">
                  <span className="text-neutral-400 text-sm">Logo {item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Investir;
