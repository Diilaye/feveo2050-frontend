import React, { useState, useEffect } from 'react';
import { X, Play, Download, ZoomIn, ArrowLeft, ArrowRight } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
}

interface GalerieProps {
  onNavigate?: (page: string) => void;
}

const Galerie: React.FC<GalerieProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Simuler le chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Données de la galerie (vraies images du projet)
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'video',
      src: '/videos/feveo2050.mp4',
      thumbnail: '/images/galerie/PHOTO-2025-07-20-13-22-56.jpg',
      title: 'Présentation FEVEO 2050',
      description: 'Découvrez notre vision pour l\'économie organique au Sénégal',
      category: 'presentation'
    },
    // Images de concept et vision
    {
      id: '2',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-56(1).jpg',
      title: 'Vision Économie Organique',
      description: 'Concept de développement durable centré sur les femmes',
      category: 'concept'
    },
    {
      id: '3',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-56(2).jpg',
      title: 'Transformation Systémique',
      description: 'Écosystème d\'investissement économique organique',
      category: 'concept'
    },
    {
      id: '4',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-57.jpg',
      title: 'Autonomisation des Femmes',
      description: 'Les femmes au cœur de la transformation économique',
      category: 'autonomisation'
    },
    {
      id: '5',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-57(1).jpg',
      title: 'Leadership Féminin',
      description: 'Formation et accompagnement des femmes leaders',
      category: 'autonomisation'
    },
    {
      id: '6',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-57(2).jpg',
      title: 'Entrepreneuriat Féminin',
      description: 'Développement de l\'entrepreneuriat féminin au Sénégal',
      category: 'autonomisation'
    },
    {
      id: '7',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-57(3).jpg',
      title: 'Réseau de Femmes',
      description: 'Constitution d\'un réseau fort de femmes entrepreneures',
      category: 'autonomisation'
    },
    // Images de GIE
    {
      id: '8',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-58.jpg',
      title: 'Formation GIE',
      description: 'Formation des Groupements d\'Intérêt Économique',
      category: 'gie'
    },
    {
      id: '9',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-58(1).jpg',
      title: 'Constitution des GIE',
      description: 'Processus de création des GIE FEVEO',
      category: 'gie'
    },
    {
      id: '10',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-58(2).jpg',
      title: 'Accompagnement GIE',
      description: 'Suivi et accompagnement des groupements',
      category: 'gie'
    },
    {
      id: '11',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-58(3).jpg',
      title: 'Validation GIE',
      description: 'Processus de validation des GIE selon les critères FEVEO',
      category: 'gie'
    },
    // Images d'investissement
    {
      id: '12',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-59.jpg',
      title: 'Cycle d\'Investissement',
      description: '1 826 jours d\'investissement organique',
      category: 'investissement'
    },
    {
      id: '13',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-59(1).jpg',
      title: 'Mécanisme de Financement',
      description: 'Structure financière innovante pour l\'économie organique',
      category: 'investissement'
    },
    {
      id: '14',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-22-59(2).jpg',
      title: 'Plateforme d\'Investissement',
      description: 'Outils digitaux pour l\'investissement participatif',
      category: 'investissement'
    },
    // Images de territoire
    {
      id: '15',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-00.jpg',
      title: 'Développement Territorial',
      description: 'Transformation des territoires par l\'économie organique',
      category: 'territoire'
    },
    {
      id: '16',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-00(1).jpg',
      title: 'Impact Local',
      description: 'Développement économique des communautés locales',
      category: 'territoire'
    },
    {
      id: '17',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-00(2).jpg',
      title: 'Aménagement du Territoire',
      description: 'Plans vastes de zones de développement',
      category: 'territoire'
    },
    // Images de technologie
    {
      id: '18',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-01.jpg',
      title: 'Innovation Technologique',
      description: 'Solutions digitales pour l\'économie organique',
      category: 'technologie'
    },
    {
      id: '19',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-01(1).jpg',
      title: 'FEVEO CASH',
      description: 'Solution de paiement mobile pour l\'écosystème FEVEO',
      category: 'technologie'
    },
    {
      id: '20',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-01(2).jpg',
      title: 'Plateforme Digitale',
      description: 'Interface utilisateur de la plateforme FEVEO 2050',
      category: 'technologie'
    },
    {
      id: '21',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-01(3).jpg',
      title: 'Outils Numériques',
      description: 'Ensemble d\'outils pour la gestion des investissements',
      category: 'technologie'
    },
    {
      id: '22',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-01(4).jpg',
      title: 'Dashboard Analytics',
      description: 'Tableau de bord analytique pour le suivi des performances',
      category: 'technologie'
    },
    // Images de partenaires et événements
    {
      id: '23',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-02.jpg',
      title: 'Écosystème de Partenaires',
      description: 'Réseau de partenaires stratégiques',
      category: 'partenaires'
    },
    {
      id: '24',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-02(1).jpg',
      title: 'Événement de Lancement',
      description: 'Présentation officielle du projet FEVEO 2050',
      category: 'partenaires'
    },
    {
      id: '25',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-02(2).jpg',
      title: 'Conférence Partenaires',
      description: 'Rencontre avec les partenaires institutionnels',
      category: 'partenaires'
    },
    {
      id: '26',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-02(3).jpg',
      title: 'Signature de Partenariats',
      description: 'Formalisation des accords de partenariat',
      category: 'partenaires'
    },
    // Ajout d'images supplémentaires pour enrichir la galerie
    {
      id: '27',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-03.jpg',
      title: 'Formation Technique',
      description: 'Sessions de formation aux outils FEVEO',
      category: 'gie'
    },
    {
      id: '28',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-03(1).jpg',
      title: 'Ateliers Pratiques',
      description: 'Ateliers de formation pratique pour les GIE',
      category: 'gie'
    },
    {
      id: '29',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-03(2).jpg',
      title: 'Certification GIE',
      description: 'Processus de certification des groupements',
      category: 'gie'
    },
    {
      id: '30',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-03(3).jpg',
      title: 'Réseau National',
      description: 'Extension du réseau FEVEO à l\'échelle nationale',
      category: 'territoire'
    },
    {
      id: '31',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-04.jpg',
      title: 'Mobilisation Communautaire',
      description: 'Engagement des communautés dans le projet',
      category: 'autonomisation'
    },
    {
      id: '32',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-04(1).jpg',
      title: 'Sensibilisation Locale',
      description: 'Campagnes de sensibilisation dans les communautés',
      category: 'autonomisation'
    },
    {
      id: '33',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-04(2).jpg',
      title: 'Inclusion Financière',
      description: 'Programmes d\'inclusion financière pour les femmes',
      category: 'investissement'
    },
    {
      id: '34',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-04(3).jpg',
      title: 'Microfinance Communautaire',
      description: 'Systèmes de microfinance adaptés aux communautés',
      category: 'investissement'
    },
    {
      id: '35',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-23-05.jpg',
      title: 'Innovation Sociale',
      description: 'Solutions innovantes pour l\'impact social',
      category: 'concept'
    },
    // Dernières images pour compléter
    {
      id: '36',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-24-05.jpg',
      title: 'Grande Distribution FEVEO',
      description: 'Projet de réseau de distribution moderne',
      category: 'concept'
    },
    {
      id: '37',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-24-05(1).jpg',
      title: 'Transport AEROBUS',
      description: 'Projet de transport aérien connecté',
      category: 'concept'
    },
    {
      id: '38',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-24-06.jpg',
      title: 'Plateforme Collaborative',
      description: 'Outils de collaboration pour les GIE',
      category: 'technologie'
    },
    {
      id: '39',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-24-06(1).jpg',
      title: 'Interface Mobile',
      description: 'Application mobile FEVEO pour les utilisateurs',
      category: 'technologie'
    },
    {
      id: '40',
      type: 'image',
      src: '/images/galerie/PHOTO-2025-07-20-13-24-06(2).jpg',
      title: 'Réseau Institutionnel',
      description: 'Partenariats avec les institutions publiques',
      category: 'partenaires'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tout voir', count: mediaItems.length },
    { id: 'presentation', name: 'Présentation', count: mediaItems.filter(item => item.category === 'presentation').length },
    { id: 'concept', name: 'Concept', count: mediaItems.filter(item => item.category === 'concept').length },
    { id: 'autonomisation', name: 'Autonomisation', count: mediaItems.filter(item => item.category === 'autonomisation').length },
    { id: 'gie', name: 'GIE', count: mediaItems.filter(item => item.category === 'gie').length },
    { id: 'investissement', name: 'Investissement', count: mediaItems.filter(item => item.category === 'investissement').length },
    { id: 'territoire', name: 'Territoire', count: mediaItems.filter(item => item.category === 'territoire').length },
    { id: 'technologie', name: 'Technologie', count: mediaItems.filter(item => item.category === 'technologie').length },
    { id: 'partenaires', name: 'Partenaires', count: mediaItems.filter(item => item.category === 'partenaires').length }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory);

  const openModal = (item: MediaItem) => {
    setSelectedMedia(item);
    setCurrentIndex(filteredItems.findIndex(media => media.id === item.id));
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setCurrentIndex(newIndex);
    setSelectedMedia(filteredItems[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedMedia(filteredItems[newIndex]);
  };

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Remplacer par une image placeholder si l'image n'existe pas
    const target = e.currentTarget;
    const originalSrc = target.src;
    
    // Éviter la boucle infinie en vérifiant si on est déjà sur le placeholder
    if (!originalSrc.includes('via.placeholder.com')) {
      target.src = `https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=${encodeURIComponent('FEVEO 2050')}`;
    }
  };

  return (
    <section id="galerie" className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-20">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <button 
            onClick={() => onNavigate?.('accueil')}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Galerie <span className="text-accent-500">FEVEO 2050</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Découvrez en images et vidéos notre vision de l'économie organique, 
            nos projets et notre impact sur le développement territorial du Sénégal.
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Grille de médias */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="aspect-square bg-neutral-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-6 bg-neutral-200 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openModal(item)}
              >
                <div className="aspect-square relative overflow-hidden">
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <img
                        src={item.thumbnail || `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Vidéo`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                        onLoad={() => handleImageLoad(item.id)}
                      />
                      <div className="absolute inset-0 bg-neutral-900/30 flex items-center justify-center">
                        <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!loadedImages.has(item.id) && (
                        <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                        onLoad={() => handleImageLoad(item.id)}
                        style={{ display: loadedImages.has(item.id) ? 'block' : 'none' }}
                      />
                    </>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <ZoomIn className="w-5 h-5" />
                        {item.type === 'video' && <Play className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Informations */}
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-xs rounded-full">
                      {categories.find(cat => cat.id === item.category)?.name || item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-neutral-400 mb-4">
              <ZoomIn className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-600 mb-2">
              Aucun média trouvé
            </h3>
            <p className="text-neutral-500">
              Essayez de sélectionner une autre catégorie.
            </p>
          </div>
        )}
      </div>

      {/* Modal de visualisation */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/90 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-6xl max-h-screen p-4 flex items-center justify-center">
            {/* Boutons de navigation */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Bouton de fermeture */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Contenu du modal */}
            <div className="relative w-full h-full flex items-center justify-center">
              {selectedMedia.type === 'video' ? (
                <div className="relative w-full max-w-4xl">
                  <video
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[80vh] rounded-lg shadow-2xl"
                  >
                    <source src={selectedMedia.src} type="video/mp4" />
                    <source src="/videos/feveo2050.mov" type="video/quicktime" />
                    Votre navigateur ne prend pas en charge la lecture vidéo.
                  </video>
                </div>
              ) : (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  onError={handleImageError}
                />
              )}
              
              {/* Informations du média */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900/80 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedMedia.title}</h3>
                <p className="text-neutral-200 mb-4">{selectedMedia.description}</p>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-accent-500 rounded-full text-sm">
                    {categories.find(cat => cat.id === selectedMedia.category)?.name || selectedMedia.category}
                  </span>
                  <span className="text-neutral-300 text-sm">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Galerie;
