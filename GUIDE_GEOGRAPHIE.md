# Guide d'utilisation des données géographiques - FEVEO 2050

## 📍 Système de sélection géographique

Le formulaire d'adhésion utilise maintenant les **données officielles du Sénégal** avec une sélection hiérarchique en cascade.

### 🗺️ Structure administrative du Sénégal

```
Région (13 régions)
├── Département (42 départements)
    ├── Arrondissement (64 arrondissements)
        └── Commune (230 communes)
```

### 🔄 Fonctionnement des dropdowns

1. **Sélection Région** → Charge les départements de cette région
2. **Sélection Département** → Charge les arrondissements de ce département  
3. **Sélection Arrondissement** → Charge les communes de cet arrondissement
4. **Sélection Commune** → Finalise la localisation

### 📊 Statistiques des données

- **13 régions** couvertes
- **42 départements** inclus
- **64 arrondissements** référencés
- **230 communes** disponibles

### 🌍 Exemple de navigation

```
Dakar → Dakar → Almadies → Ngor
Thiès → Mbour → Mbour → Mbour
Saint-Louis → Saint-Louis → Saint-Louis → Saint-Louis
```

### ⚡ Fonctionnalités techniques

#### Validation automatique
- Vérification de la cohérence géographique
- Validation des sélections en cascade
- Reset automatique des niveaux inférieurs

#### Performance
- Données chargées localement (pas d'API externe)
- Filtrage rapide et responsive
- Interface utilisateur fluide

### 🛠️ Code technique

#### Import des données
```typescript
import { 
  getRegions, 
  getDepartements, 
  getArrondissements, 
  getCommunes 
} from '../data/senegalGeography';
```

#### Utilisation dans les composants
```typescript
// Obtenir toutes les régions
const regions = getRegions();

// Obtenir les départements d'une région
const departements = getDepartements(selectedRegion);

// Obtenir les arrondissements d'un département
const arrondissements = getArrondissements(selectedRegion, selectedDepartement);

// Obtenir les communes d'un arrondissement
const communes = getCommunes(selectedRegion, selectedDepartement, selectedArrondissement);
```

### 🎯 Avantages

1. **Précision** : Données officielles du Sénégal
2. **Cohérence** : Validation hiérarchique automatique  
3. **Performance** : Données locales, pas de latence réseau
4. **UX** : Interface intuitive avec sélection guidée
5. **Maintenance** : Structure de données facilement extensible

### 🔧 Maintenance et mises à jour

Les données sont centralisées dans `/src/data/senegalGeography.ts` et peuvent être mises à jour facilement si la structure administrative change.

### 📱 Responsive

Le système de sélection géographique est entièrement responsive et fonctionne sur tous les appareils (desktop, tablette, mobile).

---

*Les données géographiques sont conformes à la structure administrative officielle du Sénégal et sont régulièrement mises à jour.*
