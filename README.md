# FEVEO 2050 - Frontend

🌟 **Plateforme d'investissement pour l'autonomisation des femmes entrepreneures sénégalaises**

## 🚀 Technologies

- **React 18** avec TypeScript
- **Vite** pour le build et développement
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **Wave Payment API** intégration complète

## ✨ Fonctionnalités

### 💳 **Système de Paiement Wave**
- Intégration complète avec l'API Wave Sénégal
- Token de production configuré
- Génération dynamique de liens de paiement
- Calcul automatique des frais (2% + minimum 60 FCFA)
- Système de fallback intelligent

### 🏛️ **Validation GIE**
- Validation en temps réel des codes GIE
- Intégration avec backend MongoDB
- Gestion d'erreurs contextuelles
- Interface utilisateur intuitive

### 📊 **Plans d'Investissement**
- **Journalier** : 6 000 FCFA/jour
- **10 jours** : 60 000 FCFA
- **15 jours** : 90 000 FCFA  
- **Mensuel** : 180 000 FCFA

## 🛠️ Installation

```bash
# Cloner le dépôt
git clone https://github.com/Diilaye/feveo2050-frontend.git

# Installer les dépendances
cd feveo2050-frontend
npm install

# Lancer en développement
npm run dev
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WAVE_TOKEN=your_wave_token_here
```

### Backend requis

Ce frontend nécessite le backend FEVEO 2050 qui doit tourner sur le port 5000.

## 🎯 Pages Principales

### 🏠 **Accueil**
- Présentation de FEVEO 2050
- Statistiques d'impact
- Témoignages

### 💼 **Investir**
- Validation du code GIE
- Sélection de la période d'investissement
- Génération et redirection vers Wave Payment

### 📋 **Adhésion**
- Formulaire d'inscription des GIE
- Géolocalisation automatique
- Validation des données

## 🔐 Sécurité

- ✅ Token Wave de production sécurisé
- ✅ Validation côté client et serveur
- ✅ Gestion d'erreurs robuste
- ✅ URLs de paiement chiffrées

## 📊 Statut du Projet

🎉 **Version 1.0.0 - PRODUCTION READY**

- ✅ Intégration Wave Payment complète
- ✅ Validation GIE opérationnelle
- ✅ Interface utilisateur finalisée
- ✅ Tests d'intégration validés
- ✅ Documentation complète

## 🌍 Impact Social

FEVEO 2050 vise à transformer l'économie sénégalaise en permettant aux GIE de femmes d'investir dans l'économie organique, créant un impact direct sur :

- 🏘️ **691 250 familles** impactées
- 👩‍💼 **365 000 femmes** autonomisées
- 💰 **2 211 900 FCFA** investis annuellement par GIE

---

**Fait avec ❤️ pour l'autonomisation des femmes sénégalaises**feveo2050
Voici une version de la description en moins de 350 caractères :  > Le GIE FEVEO est un groupement coopératif au cœur de la plateforme FEVEO 2050. Il fédère les membres, mutualise les ressources et permet d’investir dans l’économie organique via un système de gouvernance participative, de wallet solidaire et de suivi des projets en ligne.
