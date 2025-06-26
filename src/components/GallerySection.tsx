import React, { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Image, Video, Users, MapPin, Calendar, Eye, Heart, Share2, Filter, Grid, List } from 'lucide-react';

const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    { id: 'all', name: 'Tout voir', count: 48 },
    { id: 'agriculture', name: 'Agriculture', count: 15 },
    { id: 'transformation', name: 'Transformation', count: 12 },
    { id: 'commerce', name: 'Commerce', count: 10 },
    { id: 'formation', name: 'Formation', count: 8 },
    { id: 'evenements', name: 'Événements', count: 3 }
  ];

  const mediaItems = [
    // Agriculture
    {
      id: 1,
      type: 'image',
      url: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Production Maraîchère - GIE Ndèye Fatou',
      description: 'Cultivation de légumes biologiques dans la région de Thiès avec techniques d\'irrigation moderne',
      category: 'agriculture',
      location: 'Thiès, Sénégal',
      date: '2024-01-15',
      views: 1250,
      likes: 89,
      gie: 'GIE Ndèye Fatou'
    },
    {
      id: 2,
      type: 'video',
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Récolte de Riz - Coopérative Yaay Boury',
      description: 'Processus de récolte mécanisée dans les rizières de la vallée du fleuve Sénégal',
      category: 'agriculture',
      location: 'Saint-Louis, Sénégal',
      date: '2024-01-20',
      views: 2100,
      likes: 156,
      gie: 'Coopérative Yaay Boury',
      duration: '3:45'
    },
    {
      id: 3,
      type: 'image',
      url: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Élevage Avicole Moderne',
      description: 'Ferme avicole équipée de technologies modernes pour l\'élevage de poulets de chair',
      category: 'agriculture',
      location: 'Kaolack, Sénégal',
      date: '2024-01-25',
      views: 980,
      likes: 67,
      gie: 'GIE Diongoma'
    },

    // Transformation
    {
      id: 4,
      type: 'image',
      url: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Unité de Transformation Céréalière',
      description: 'Transformation du mil et du sorgho en farine enrichie pour la nutrition infantile',
      category: 'transformation',
      location: 'Diourbel, Sénégal',
      date: '2024-02-01',
      views: 1450,
      likes: 102,
      gie: 'GIE Soxna Beye'
    },
    {
      id: 5,
      type: 'video',
      url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Production d\'Huile d\'Arachide',
      description: 'Processus complet de transformation des arachides en huile de qualité premium',
      category: 'transformation',
      location: 'Fatick, Sénégal',
      date: '2024-02-05',
      views: 1890,
      likes: 134,
      gie: 'GIE Mame Diarra',
      duration: '5:20'
    },
    {
      id: 6,
      type: 'image',
      url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Atelier de Transformation Fruits',
      description: 'Production de confitures et jus naturels à partir de mangues et bissap locaux',
      category: 'transformation',
      location: 'Ziguinchor, Sénégal',
      date: '2024-02-10',
      views: 1120,
      likes: 78,
      gie: 'GIE Kër Jaboot'
    },

    // Commerce
    {
      id: 7,
      type: 'image',
      url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Marché Hebdomadaire - Produits Bio',
      description: 'Stand de vente de produits biologiques certifiés au marché central de Dakar',
      category: 'commerce',
      location: 'Dakar, Sénégal',
      date: '2024-02-15',
      views: 2250,
      likes: 189,
      gie: 'GIE Teranga Bio'
    },
    {
      id: 8,
      type: 'video',
      url: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Boutique Coopérative Moderne',
      description: 'Visite de la nouvelle boutique équipée de systèmes de paiement digitaux',
      category: 'commerce',
      location: 'Thiès, Sénégal',
      date: '2024-02-20',
      views: 1670,
      likes: 123,
      gie: 'GIE Jokko Commerce',
      duration: '4:15'
    },

    // Formation
    {
      id: 9,
      type: 'image',
      url: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Formation Gestion Financière',
      description: 'Session de formation sur la gestion des finances et la comptabilité pour les GIE',
      category: 'formation',
      location: 'Dakar, Sénégal',
      date: '2024-02-25',
      views: 890,
      likes: 65,
      gie: 'Centre Formation FEVEO'
    },
    {
      id: 10,
      type: 'video',
      url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Atelier Techniques Agricoles',
      description: 'Formation pratique sur les nouvelles techniques d\'irrigation et de fertilisation',
      category: 'formation',
      location: 'Tambacounda, Sénégal',
      date: '2024-03-01',
      views: 1340,
      likes: 98,
      gie: 'Centre Formation FEVEO',
      duration: '6:30'
    },

    // Événements
    {
      id: 11,
      type: 'image',
      url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Cérémonie de Remise de Certificats',
      description: 'Remise officielle des certificats d\'investissement aux nouveaux GIE affiliés',
      category: 'evenements',
      location: 'Dakar, Sénégal',
      date: '2024-03-05',
      views: 3200,
      likes: 245,
      gie: 'FEVEO 2050'
    },
    {
      id: 12,
      type: 'video',
      url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Forum Annuel FEVEO 2050',
      description: 'Highlights du forum annuel réunissant tous les GIE partenaires et investisseurs',
      category: 'evenements',
      location: 'Saly, Sénégal',
      date: '2024-03-10',
      views: 4500,
      likes: 356,
      gie: 'FEVEO 2050',
      duration: '8:45'
    }
  ];

  const filteredMedia = activeFilter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeFilter);

  const openModal = (media, index) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setCurrentIndex(0);
  };

  const navigateMedia = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredMedia.length
      : (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    
    setCurrentIndex(newIndex);
    setSelectedMedia(filteredMedia[newIndex]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="galerie" className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Galerie des
            <span className="block text-accent-500">Activités Économiques</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez en images et vidéos toutes les activités économiques en cours dans notre plateforme d'investissement
          </p>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeFilter === category.id
                    ? 'bg-accent-500 text-neutral-50 shadow-md'
                    : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:border-accent-300 hover:text-accent-500'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-neutral-50 rounded-lg border border-neutral-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-accent-500 text-neutral-50'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-accent-500 text-neutral-50'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((media, index) => (
              <div
                key={media.id}
                className="group cursor-pointer"
                onClick={() => openModal(media, index)}
              >
                <div className="card p-0 overflow-hidden hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={media.thumbnail}
                      alt={media.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Media Type Indicator */}
                    <div className="absolute top-3 left-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        media.type === 'video' 
                          ? 'bg-red-500 text-neutral-50' 
                          : 'bg-blue-500 text-neutral-50'
                      }`}>
                        {media.type === 'video' ? (
                          <div className="flex items-center">
                            <Video className="w-3 h-3 mr-1" />
                            {media.duration}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Image className="w-3 h-3 mr-1" />
                            Photo
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Play Button for Videos */}
                    {media.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-neutral-50/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-accent-500 ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Stats Overlay */}
                    <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                      <div className="bg-neutral-900/50 text-neutral-50 px-2 py-1 rounded-full text-xs flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {media.views.toLocaleString()}
                      </div>
                      <div className="bg-neutral-900/50 text-neutral-50 px-2 py-1 rounded-full text-xs flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {media.likes}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-neutral-900 mb-2 line-clamp-2">{media.title}</h3>
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{media.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {media.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(media.date)}
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-neutral-100">
                      <div className="text-xs font-medium text-accent-600">{media.gie}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {filteredMedia.map((media, index) => (
              <div
                key={media.id}
                className="card cursor-pointer hover:scale-[1.02] transition-all duration-300"
                onClick={() => openModal(media, index)}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative md:w-64 flex-shrink-0">
                    <img
                      src={media.thumbnail}
                      alt={media.title}
                      className="w-full h-48 md:h-32 object-cover rounded-lg"
                    />
                    
                    {media.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/20 rounded-lg">
                        <div className="w-12 h-12 bg-neutral-50/90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-accent-500 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-neutral-900">{media.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        media.type === 'video' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {media.type === 'video' ? `Vidéo ${media.duration}` : 'Photo'}
                      </div>
                    </div>
                    
                    <p className="text-neutral-600 mb-4">{media.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {media.gie}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {media.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(media.date)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {media.views.toLocaleString()} vues
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {media.likes} j'aime
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredMedia.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Aucun contenu trouvé</h3>
            <p className="text-neutral-600">Aucun média ne correspond aux filtres sélectionnés.</p>
          </div>
        )}

        {/* Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/90 backdrop-blur-sm">
            <div className="relative w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-neutral-900/50 hover:bg-neutral-900/70 text-neutral-50 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateMedia('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-neutral-900/50 hover:bg-neutral-900/70 text-neutral-50 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => navigateMedia('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-neutral-900/50 hover:bg-neutral-900/70 text-neutral-50 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="bg-neutral-50 rounded-xl overflow-hidden">
                {/* Media Display */}
                <div className="relative">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-96 object-cover"
                  />
                  
                  {selectedMedia.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/30">
                      <div className="w-20 h-20 bg-neutral-50/90 rounded-full flex items-center justify-center">
                        <Play className="w-10 h-10 text-accent-500 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">{selectedMedia.title}</h3>
                      <p className="text-neutral-600 leading-relaxed">{selectedMedia.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors duration-200">
                        <Heart className="w-5 h-5 text-neutral-600" />
                      </button>
                      <button className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors duration-200">
                        <Share2 className="w-5 h-5 text-neutral-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-500 mb-1">GIE</div>
                      <div className="font-medium text-accent-600">{selectedMedia.gie}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 mb-1">Localisation</div>
                      <div className="font-medium">{selectedMedia.location}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 mb-1">Date</div>
                      <div className="font-medium">{formatDate(selectedMedia.date)}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 mb-1">Statistiques</div>
                      <div className="font-medium">{selectedMedia.views.toLocaleString()} vues • {selectedMedia.likes} j'aime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;