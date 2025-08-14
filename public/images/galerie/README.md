# Galerie FEVEO 2050

Cette galerie présente les différents aspects du projet FEVEO 2050 à travers des images réelles organisées par catégories.

## Images Actuelles

La galerie contient actuellement **40 images réelles** du projet FEVEO 2050, prises le 20 juillet 2025, organisées dans les catégories suivantes :

## Catégories

1. **Présentation** (1 vidéo) - Vidéo de présentation générale + thumbnail
2. **Concept** (5 images) - Images illustrant l'économie organique et les concepts FEVEO
3. **Autonomisation** (7 images) - Photos montrant l'autonomisation et la mobilisation des femmes
4. **GIE** (7 images) - Images des Groupements d'Intérêt Économique et formations
5. **Investissement** (5 images) - Visuels du cycle d'investissement et mécanismes financiers
6. **Territoire** (4 images) - Photos du développement territorial et impact local
7. **Technologie** (6 images) - Images des solutions technologiques et plateformes digitales
8. **Partenaires** (5 images) - Photos de l'écosystème de partenaires et événements

## Répartition des Images

Les images sont automatiquement réparties selon cette logique :
- **PHOTO-2025-07-20-13-22-xx** → Concept, Autonomisation, GIE
- **PHOTO-2025-07-20-13-23-xx** → Investissement, Territoire, Technologie, Partenaires
- **PHOTO-2025-07-20-13-24-xx** → Concept avancé, Technologie, Partenaires

## Fonctionnalités

- ✅ **40 images réelles** du projet FEVEO 2050
- ✅ Filtrage par catégorie avec compteurs dynamiques
- ✅ Modal de visualisation plein écran
- ✅ Navigation par flèches entre les médias
- ✅ Support des images et vidéos
- ✅ Design responsive et moderne
- ✅ Indicateurs de chargement pour les images
- ✅ Fallback automatique vers placeholder si image manquante
- ✅ Animation de chargement au démarrage

## Ajout de nouveaux médias

Pour ajouter de nouveaux médias à la galerie :

1. Placez vos images dans le dossier `public/images/galerie/`
2. Placez vos vidéos dans le dossier `public/videos/`
3. Modifiez le tableau `mediaItems` dans `src/components/Galerie.tsx`
4. Assurez-vous que les chemins correspondent à vos fichiers

## Format des médias recommandé

- **Images** : JPG, PNG, WebP (max 2MB, résolution recommandée 1200x800px)
- **Vidéos** : MP4, MOV (max 50MB, résolution recommandée 1920x1080px)
- **Thumbnails vidéo** : JPG, PNG (résolution recommandée 400x300px)
