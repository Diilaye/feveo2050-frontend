/**
 * Service de validation des GIE (Groupements d'Intérêt Économique)
 * Vérifie l'éligibilité des GIE pour les investissements FEVEO 2050
 */


const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3051/api';

// 

/**
 * Interface TypeScript pour un GIE
 */
export interface GIE {
  id: string;
  nom: string;
  numeroRegistre: string;
  secteurActivite: string;
  statut: string;
  validePourInvestissement: boolean;
  documentsPourcentage: number;
  dateCreation: Date;
  adresse: string;
  description: string;
}

export class GieValidationService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = BASE_URL;
  }

  /**
   * Valide un GIE par son numéro d'enregistrement
   */
  async validateGie(numeroRegistre: string): Promise<{isValid: boolean, gie?: GIE, error?: string}> {
    try {
      if (!numeroRegistre || numeroRegistre.trim() === '') {
        return {
          isValid: false,
          error: 'Le numéro d\'enregistrement est requis'
        };
      }

      console.log('🔍 Validation du GIE:', numeroRegistre);

      console.log(`📞 Appel API de validation GIE: ${BASE_URL}/gie/validate/${encodeURIComponent(numeroRegistre)}`);
      

      const response = await fetch(`${BASE_URL}/gie/validate/${encodeURIComponent(numeroRegistre)}`, {
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
        
        // Adapter les données du backend au format attendu par le frontend
        const gieAdapte: GIE = {
          id: data.gie.id,
          nom: data.gie.nom,
          numeroRegistre: data.gie.numeroRegistre,
          secteurActivite: data.gie.secteurActivite,
          statut: data.gie.statut,
          validePourInvestissement: data.gie.validePourInvestissement,
          documentsPourcentage: data.gie.documentsPourcentage,
          dateCreation: new Date(data.gie.dateCreation),
          adresse: data.gie.adresse,
          description: data.gie.description
        };
        
        return {
          isValid: true,
          gie: gieAdapte
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
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log('🔄 Utilisation des données mock en fallback');
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
   */
  async getAllGies(): Promise<{success: boolean, gies?: GIE[], error?: string}> {
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
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
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
   */
  async getGieById(gieId: string): Promise<{success: boolean, gie?: GIE, error?: string}> {
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
   */
  checkInvestmentEligibility(gie: GIE): {isEligible: boolean, reasons: string[]} {
    const reasons: string[] = [];

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
      const diffJours = Math.floor((maintenant.getTime() - dateCreation.getTime()) / (1000 * 60 * 60 * 24));
      
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
  getMockGieValidation(numeroRegistre: string): {isValid: boolean, gie?: GIE, error?: string} {
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
  getMockGies(): GIE[] {
    return [
      {
        id: '689c7f6e07e436def3951995',
        nom: 'FEVEO-12-01-02-01-001',
        numeroRegistre: 'FEVEO-12-01-02-01-001',
        secteurActivite: 'Agriculture',
        statut: 'en_attente',
        validePourInvestissement: false,
        documentsPourcentage: 75,
        dateCreation: new Date('2025-08-13'),
        adresse: '01, BAKEL, TAMBACOUNDA',
        description: 'GIE FEVEO spécialisé dans l\'agriculture durable'
      },
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
   */
  formatGieInfo(gie: GIE): string {
    if (!gie) return 'Aucune information disponible';

    const eligibility = this.checkInvestmentEligibility(gie);
    const statusIcon = gie.statut === 'actif' ? '✅' : gie.statut === 'en_attente' ? '⏳' : '❌';
    const eligibilityIcon = eligibility.isEligible ? '✅' : '❌';

    let info = `
      ${statusIcon} ${gie.nom}
      📋 N° Registre: ${gie.numeroRegistre}
      🏢 Secteur: ${gie.secteurActivite}
      📍 Adresse: ${gie.adresse}
      📊 Documents: ${gie.documentsPourcentage}%
      📅 Créé le: ${gie.dateCreation.toLocaleDateString('fr-FR')}
      ${eligibilityIcon} Éligible: ${eligibility.isEligible ? 'Oui' : 'Non'}
    `.trim();

    if (!eligibility.isEligible && eligibility.reasons.length > 0) {
      info += '\n⚠️ Raisons: ' + eligibility.reasons.join(', ');
    }

    if (gie.statut === 'en_attente') {
      info += '\n💡 Statut: En attente de validation de paiement FEVEO 2050';
    }

    return info;
  }
}

// Export de l'instance du service
const gieValidationService = new GieValidationService();
export default gieValidationService;
