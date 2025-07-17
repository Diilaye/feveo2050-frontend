import React, { useState } from 'react';
import { Play, TrendingUp, Users, Calendar, Target, Heart, Lightbulb, X } from 'lucide-react';

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [showVideo, setShowVideo] = useState(false);

  const metrics = [
    { icon: TrendingUp, value: '?', label: 'GIEs enregistrés', color: 'text-accent-500' },
    { icon: Users, value: '691 250', label: 'Nbre min. de femmes', color: 'text-success-500' },
    { icon: Users, value: '331 800', label: 'Nbre de jeunes', color: 'text-accent-500' },
    { icon: Users, value: '82 950', label: 'Nbre d’adultes', color: 'text-success-500' },
    { icon: Calendar, value: '1 826', label: 'Nbre jours d’invest', color: 'text-accent-500' },
  ];

  const visionMission = [
    {
      icon: Target,
      title: 'Notre Vision',
      description: 'Créer un écosystème d’investissement Économique organique pour faire des femmes le moteur de la transformation systémique de l’économie du Sénégal',
      color: 'bg-primary-500'
    },
    {
      icon: Heart,
      title: 'Notre Mission',
      description: 'Placer les femmes au cœur du système de création de richesses par l’exploitation de toute la chaine de valeur',
      color: 'bg-success-500'
    },
    {
      icon: Lightbulb,
      title: 'Nos Projets',
      description: '',
      color: 'bg-accent-500',
      projects: [
        {
          name: 'FEVEO GRANDE DISTRIBUTION',
          icon: '🏪',
          description: 'Réseau de distribution moderne et innovant',
          color: 'bg-blue-500/20 border-blue-400/30'
        },
        {
          name: 'PLANS VASTES DE ZONES',
          icon: '🏗️',
          description: 'Développement territorial intégré',
          color: 'bg-green-500/20 border-green-400/30'
        },
        {
          name: 'AEROBUS',
          icon: '✈️',
          description: 'Transport aérien connecté',
          color: 'bg-purple-500/20 border-purple-400/30'
        },
        {
          name: 'FEVEO CASH',
          icon: '💰',
          description: 'Solutions financières digitales',
          color: 'bg-yellow-500/20 border-yellow-400/30'
        }
      ]
    }
  ];

  return (
    <section id="accueil" className="relative min-h-screen">
      {/* Background Slideshow */}
      <div className="absolute inset-0 background-slideshow-enhanced"></div>
      <div className="absolute inset-0 bg-primary-900/30"></div>
      
      <div className="relative z-10 container-max section-padding py-20">
        {/* Main Hero Content */}
        <div className="max-w-4xl mx-auto text-center text-neutral-50 mb-20">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
             AVEC INVESTISSEMENT 
              <span className="block text-accent-400">« FEVEO 2050 »</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-100 mb-8  mx-auto leading-relaxed">
              L’avenir de l’investissement en économie organique, à partir du Sénégal
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => onNavigate?.('about')}
                className="btn-accent text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200"
              >
                Découvrir la plateforme
              </button>
              <button 
                onClick={() => setShowVideo(true)}
                className="btn-secondary bg-neutral-50/10 border-neutral-50/20 text-neutral-50 hover:bg-neutral-50/20 text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200"
              >
                Voir la gallery
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-4xl mx-auto animate-fade-in">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-50/10 backdrop-blur-sm rounded-full mb-4">
                  <metric.icon className={`w-8 h-8 ${metric.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{metric.value}</div>
                <div className="text-neutral-200 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision, Mission, Projets */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-4">
              Présentation FEVEO 2050
            </h2>
            <p className="text-xl text-neutral-200 max-w-2xl mx-auto">
             Une vision d’entreprise en économie organique, autour des femmes, dans la perspective d’une transformation structurelle des potentiels économiques territoriales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visionMission.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-neutral-50/10 backdrop-blur-sm rounded-xl p-6 border border-neutral-50/20 hover:bg-neutral-50/15 transition-all duration-300 h-full">
                  <div className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-neutral-50" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-50 mb-4">{item.title}</h3>
                  
                  {item.title === 'Nos Projets' ? (
                    <div className="space-y-3">
                      {item.projects?.map((project, projIndex) => (
                        <div className="flex-1" key={projIndex}>
                              <h4 className="font-semibold text-neutral-50 text-sm mb-1 group-hover/project:text-accent-400 transition-colors duration-300">
                                ❖ {project.name}
                              </h4>
                              {/* <p className="text-neutral-300 text-xs leading-relaxed">
                                {project.description}
                              </p> */}
                            </div>
                      ))}
                      
                     
                    </div>
                  ) : (
                    <p className="text-neutral-200 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-neutral-50/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neutral-50/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-neutral-50 hover:text-neutral-300 transition-colors duration-200"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-neutral-50 rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                <div className="text-center text-neutral-50">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Vidéo Tutoriel FEVEO 2050</h3>
                  <p className="text-neutral-300 max-w-md mx-auto">
                    Découvrez notre plateforme d'investissement en économie organique, 
                    le parcours d'adhésion et la souscription aux parts sociales.
                  </p>
                  <button 
                    onClick={() => setShowVideo(false)}
                    className="mt-6 btn-accent"
                  >
                    Fermer la vidéo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;