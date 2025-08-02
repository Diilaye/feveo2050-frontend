// Service pour gérer les erreurs de validation GIE côté frontend
// /src/services/gieValidationService.tsx

import React, { useState } from 'react';
import { AlertCircle, XCircle, Info } from 'lucide-react';

export const GIE_ERROR_CODES = {
  GIE_NOT_FOUND: 'GIE_NOT_FOUND',
  GIE_NOT_VALIDATED: 'GIE_NOT_VALIDATED',
  CYCLE_NOT_FOUND: 'CYCLE_NOT_FOUND',
  MISSING_GIE_ID: 'MISSING_GIE_ID'
};

export const GIE_ERROR_MESSAGES = {
  [GIE_ERROR_CODES.GIE_NOT_FOUND]: {
    title: 'GIE Non Trouvé',
    message: 'Le GIE que vous recherchez n\'existe pas ou a été supprimé.',
    action: 'Vérifiez l\'identifiant du GIE ou contactez l\'administration.',
    severity: 'error'
  },
  [GIE_ERROR_CODES.GIE_NOT_VALIDATED]: {
    title: 'GIE Non Validé',
    message: 'Votre GIE n\'est pas encore validé pour les investissements.',
    action: 'Attendez la validation de votre adhésion ou contactez l\'administration.',
    severity: 'warning'
  },
  [GIE_ERROR_CODES.CYCLE_NOT_FOUND]: {
    title: 'Cycle d\'Investissement Manquant',
    message: 'Le cycle d\'investissement n\'a pas été créé pour votre GIE.',
    action: 'Contactez l\'administration pour créer votre cycle d\'investissement.',
    severity: 'error'
  },
  [GIE_ERROR_CODES.MISSING_GIE_ID]: {
    title: 'Paramètre Manquant',
    message: 'L\'identifiant du GIE est requis pour cette opération.',
    action: 'Sélectionnez un GIE valide.',
    severity: 'error'
  }
};

/**
 * Traite les erreurs de validation GIE et retourne les informations formatées
 * @param {Object} error - Erreur retournée par l'API
 * @returns {Object} - Informations formatées pour l'affichage
 */
export const handleGIEValidationError = (error) => {
  const { response } = error;
  
  if (!response || !response.data) {
    return {
      title: 'Erreur Inconnue',
      message: 'Une erreur inattendue s\'est produite.',
      action: 'Veuillez réessayer plus tard.',
      severity: 'error'
    };
  }

  const { code, message, data } = response.data;
  const errorInfo = GIE_ERROR_MESSAGES[code];

  if (!errorInfo) {
    return {
      title: 'Erreur',
      message: message || 'Une erreur s\'est produite.',
      action: 'Veuillez réessayer.',
      severity: 'error'
    };
  }

  // Personnaliser le message avec les données spécifiques
  let customMessage = errorInfo.message;
  let customAction = errorInfo.action;

  if (code === GIE_ERROR_CODES.GIE_NOT_VALIDATED && data) {
    customMessage = `Votre GIE "${data.nomGIE}" n'est pas encore validé. Statut actuel: ${data.gieStatut}.`;
    customAction = 'Attendez la validation de votre adhésion. Date de création: ' + 
                   new Date(data.dateCreation).toLocaleDateString('fr-FR');
  }

  if (code === GIE_ERROR_CODES.CYCLE_NOT_FOUND && data) {
    customMessage = `Le cycle d'investissement pour "${data.nomGIE}" n'a pas été trouvé.`;
  }

  return {
    title: errorInfo.title,
    message: customMessage,
    action: customAction,
    severity: errorInfo.severity,
    data: data
  };
};

/**
 * Composant React pour afficher les erreurs de validation GIE
 * @param {Object} error - Erreur de validation
 * @returns {JSX.Element} - Composant d'erreur
 */
export const GIEValidationErrorComponent = ({ error, onRetry, onContact }) => {
  const errorInfo = handleGIEValidationError(error);

  const getIcon = () => {
    switch (errorInfo.severity) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getBackgroundColor = () => {
    switch (errorInfo.severity) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (errorInfo.severity) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className={`p-6 rounded-lg border ${getBackgroundColor()}`}>
      <div className="flex items-start gap-4">
        <div className="text-2xl">{getIcon()}</div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${getTextColor()} mb-2`}>
            {errorInfo.title}
          </h3>
          <p className={`${getTextColor()} mb-3`}>
            {errorInfo.message}
          </p>
          <p className={`text-sm ${getTextColor()} mb-4`}>
            {errorInfo.action}
          </p>
          
          {/* Informations additionnelles si disponibles */}
          {errorInfo.data && (
            <div className="bg-white p-3 rounded border mt-3">
              <h4 className="font-medium text-neutral-700 mb-2">Détails:</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                {errorInfo.data.nomGIE && (
                  <li><strong>GIE:</strong> {errorInfo.data.nomGIE}</li>
                )}
                {errorInfo.data.identifiantGIE && (
                  <li><strong>Identifiant:</strong> {errorInfo.data.identifiantGIE}</li>
                )}
                {errorInfo.data.gieStatut && (
                  <li><strong>Statut:</strong> {errorInfo.data.gieStatut}</li>
                )}
                {errorInfo.data.dateCreation && (
                  <li><strong>Date de création:</strong> {new Date(errorInfo.data.dateCreation).toLocaleDateString('fr-FR')}</li>
                )}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-accent-500 text-white rounded hover:bg-accent-600 transition-colors"
              >
                Réessayer
              </button>
            )}
            {onContact && (
              <button
                onClick={onContact}
                className="px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600 transition-colors"
              >
                Contacter l'administration
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook personnalisé pour gérer la validation GIE
 * @returns {Object} - Fonctions et état pour gérer la validation
 */
export const useGIEValidation = () => {
  const [validationError, setValidationError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedGIE, setValidatedGIE] = useState(null);

  const clearError = () => {
    setValidationError(null);
    setValidatedGIE(null);
  };

  const validateGIE = async (codeGIE: string) => {
    setIsValidating(true);
    setValidationError(null);
    setValidatedGIE(null);

    try {
      const response = await fetch('https://api.feveo2025.sn/api/investissements/validate-gie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codeGIE }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorInfo = handleGIEValidationError({ response: { status: response.status, data } });
        setValidationError(errorInfo);
        setIsValidating(false);
        return false;
      }

      // Succès
      setValidatedGIE(data.data);
      setIsValidating(false);
      return true;

    } catch (error) {
      console.error('Erreur de réseau:', error);
      const errorInfo = {
        code: 'NETWORK_ERROR',
        message: 'Erreur de connexion au serveur',
        severity: 'error',
        retryable: true
      };
      setValidationError(errorInfo);
      setIsValidating(false);
      return false;
    }
  };

  return {
    validationError,
    isValidating,
    validatedGIE,
    clearError,
    validateGIE
  };
};

// Exemple d'utilisation dans un composant (commenté)
// const InvestmentComponent = ({ gieId }) => {
//   const { validationError, isValidating, validateGIE, retryValidation } = useGIEValidation();
//   
//   const loadInvestmentData = async () => {
//     try {
//       await validateGIE(gieId, async (id) => {
//         const response = await fetch(`/api/investissements/gie/${id}`);
//         const data = await response.json();
//         return data;
//       });
//     } catch (error) {
//       console.error('Erreur de validation:', error);
//     }
//   };
//
//   if (validationError) {
//     return (
//       <GIEValidationErrorComponent
//         error={{ response: { data: validationError } }}
//         onRetry={() => retryValidation(gieId, loadInvestmentData)}
//         onContact={() => window.open('/contact', '_blank')}
//       />
//     );
//   }
//
//   return <div>Interface d'investissement</div>;
// };
