/**
 * Service de validation des GIE (Groupements d'Intérêt Économique)
 * Vérifie l'éligibilité des GIE pour les investissements FEVEO 2050
 */

const API_BASE_URL = 'https://api.feveo2025.sn/api';

/**
 * Interface TypeScript pour un GIE
 * @typedef {Object} GIE
 * @property {string} id - Identifiant unique du GIE
 * @property {string} nom - Nom du GIE
 * @property {string} numeroRegistre - Numéro d'enregistrement officiel
 * @property {string} secteurActivite - Secteur d'activité
 * @property {string} statut - Statut du GIE (actif, inactif, suspendu)
 * @property {boolean} validePourInvestissement - Éligibilité pour investissement
 * @property {number} documentsPourcentage - Pourcentage de documents fournis
 * @property {Date} dateCreation - Date de création
 * @property {string} adresse - Adresse du GIE
 * @property {string} description - Description des activités
 */

class GieValidationService {
  constructor() {
    this.apiUrl = API_BASE_URL;
  }

  /**
   * Valide un GIE par son numéro d'enregistrement
   * @param {string} numeroRegistre - Numéro d'enregistrement du GIE
   * @returns {Promise<{isValid: boolean, gie?: GIE, error?: string}>}
   */
  async validateGie(numeroRegistre) {
    try {
      if (!numeroRegistre || numeroRegistre.trim() === '') {
        return {
          isValid: false,
          error: 'Le numéro d\'enregistrement est requis'
        };
      }

      console.log('🔍 Validation du GIE:', numeroRegistre);

      const response = await fetch(`${this.apiUrl}/gie/validate/${encodeURIComponent(numeroRegistre)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur validation GIE:', data);
        return {
          isValid: false,
          error: data.message || `Erreur serveur: ${response.status}`
        };
      }

      if (data.success && data.gie) {
        console.log('✅ GIE validé:', data.gie);
        return {
          isValid: true,
          gie: data.gie
        };
      } else {
        return {
          isValid: false,
          error: data.message || 'GIE non trouvé ou invalide'
        };
      }

    } catch (error) {
      console.error('❌ Erreur lors de la validation du GIE:', error);
      
      // Fallback avec données mock pour le développement
      if (process.env.NODE_ENV === 'development') {
        return this.getMockGieValidation(numeroRegistre);
      }

      return {
        isValid: false,
        error: 'Erreur de connexion au serveur de validation'
      };
    }
  }

  /**
   * Récupère tous les GIE disponibles
   * @returns {Promise<{success: boolean, gies?: GIE[], error?: string}>}
   */
  async getAllGies() {
    try {
      console.log('📋 Récupération de tous les GIE...');

      const response = await fetch(`${this.apiUrl}/gie`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur récupération GIE:', data);
        return {
          success: false,
          error: data.message || `Erreur serveur: ${response.status}`
        };
      }

      console.log('✅ GIE récupérés:', data.gies?.length || 0);
      return {
        success: true,
        gies: data.gies || []
      };

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des GIE:', error);
      
      // Fallback avec données mock pour le développement
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          gies: this.getMockGies()
        };
      }

      return {
        success: false,
        error: 'Erreur de connexion au serveur'
      };
    }
  }

  /**
   * Récupère un GIE spécifique par son ID
   * @param {string} gieId - Identifiant du GIE
   * @returns {Promise<{success: boolean, gie?: GIE, error?: string}>}
   */
  async getGieById(gieId) {
    try {
      if (!gieId) {
        return {
          success: false,
          error: 'Identifiant GIE requis'
        };
      }

      console.log('🔍 Récupération du GIE:', gieId);

      const response = await fetch(`${this.apiUrl}/gie/${gieId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `Erreur serveur: ${response.status}`
        };
      }

      return {
        success: true,
        gie: data.gie
      };

    } catch (error) {
      console.error('❌ Erreur lors de la récupération du GIE:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur'
      };
    }
  }

  /**
   * Vérifie l'éligibilité d'un GIE pour un investissement
   * @param {GIE} gie - Objet GIE à vérifier
   * @returns {{isEligible: boolean, reasons: string[]}}
   */
  checkInvestmentEligibility(gie) {
    const reasons = [];

    if (!gie) {
      return {
        isEligible: false,
        reasons: ['GIE non fourni']
      };
    }

    // Vérification du statut
    if (gie.statut !== 'actif') {
      reasons.push('Le GIE doit avoir un statut actif');
    }

    // Vérification de la validation pour investissement
    if (!gie.validePourInvestissement) {
      reasons.push('Le GIE n\'est pas encore validé pour les investissements');
    }

    // Vérification du pourcentage de documents
    const minDocumentsPourcentage = 75;
    if (gie.documentsPourcentage < minDocumentsPourcentage) {
      reasons.push(`Documents incomplets (${gie.documentsPourcentage}% fournis, minimum ${minDocumentsPourcentage}% requis)`);
    }

    // Vérification de l'âge du GIE (minimum 30 jours)
    if (gie.dateCreation) {
      const dateCreation = new Date(gie.dateCreation);
      const maintenant = new Date();
      const diffJours = Math.floor((maintenant - dateCreation) / (1000 * 60 * 60 * 24));
      
      if (diffJours < 30) {
        reasons.push(`GIE trop récent (${diffJours} jours, minimum 30 jours requis)`);
      }
    }

    return {
      isEligible: reasons.length === 0,
      reasons
    };
  }

  /**
   * Données mock pour le développement (fallback)
   */
  getMockGieValidation(numeroRegistre) {
    const mockGies = this.getMockGies();
    const gie = mockGies.find(g => g.numeroRegistre === numeroRegistre);
    
    if (gie) {
      return {
        isValid: true,
        gie
      };
    }

    return {
      isValid: false,
      error: 'GIE non trouvé dans les données de test'
    };
  }

  /**
   * Données mock des GIE pour le développement
   */
  getMockGies() {
    return [
      {
        id: '1',
        nom: 'Coopérative Agricole Kaolack',
        numeroRegistre: 'GIE-2024-001',
        secteurActivite: 'Agriculture',
        statut: 'actif',
        validePourInvestissement: true,
        documentsPourcentage: 85,
        dateCreation: new Date('2024-01-15'),
        adresse: 'Kaolack, Sénégal',
        description: 'Production et transformation de céréales'
      },
      {
        id: '2',
        nom: 'Groupement Femmes Transformatrices',
        numeroRegistre: 'GIE-2024-002',
        secteurActivite: 'Transformation',
        statut: 'actif',
        validePourInvestissement: true,
        documentsPourcentage: 92,
        dateCreation: new Date('2024-02-01'),
        adresse: 'Thiès, Sénégal',
        description: 'Transformation de produits locaux'
      },
      {
        id: '3',
        nom: 'Coopérative Pêche Artisanale',
        numeroRegistre: 'GIE-2024-003',
        secteurActivite: 'Pêche',
        statut: 'actif',
        validePourInvestissement: false,
        documentsPourcentage: 65,
        dateCreation: new Date('2024-03-01'),
        adresse: 'Saint-Louis, Sénégal',
        description: 'Pêche artisanale et commercialisation'
      },
      {
        id: '4',
        nom: 'GIE Artisanat Local',
        numeroRegistre: 'GIE-2024-004',
        secteurActivite: 'Artisanat',
        statut: 'inactif',
        validePourInvestissement: false,
        documentsPourcentage: 45,
        dateCreation: new Date('2024-04-01'),
        adresse: 'Diourbel, Sénégal',
        description: 'Artisanat traditionnel et moderne'
      }
    ];
  }

  /**
   * Formate les informations d'un GIE pour l'affichage
   * @param {GIE} gie - Objet GIE
   * @returns {string} Informations formatées
   */
  formatGieInfo(gie) {
    if (!gie) return 'Aucune information disponible';

    const eligibility = this.checkInvestmentEligibility(gie);
    const statusIcon = gie.statut === 'actif' ? '✅' : '❌';
    const eligibilityIcon = eligibility.isEligible ? '✅' : '❌';

    return `
      ${statusIcon} ${gie.nom}
      📋 N° Registre: ${gie.numeroRegistre}
      🏢 Secteur: ${gie.secteurActivite}
      📍 Adresse: ${gie.adresse}
      📊 Documents: ${gie.documentsPourcentage}%
      ${eligibilityIcon} Éligible: ${eligibility.isEligible ? 'Oui' : 'Non'}
      ${!eligibility.isEligible ? '⚠️ Raisons: ' + eligibility.reasons.join(', ') : ''}
    `.trim();
  }
}

// Export du service
const gieValidationService = new GieValidationService();
export { gieValidationService };
export default gieValidationService;