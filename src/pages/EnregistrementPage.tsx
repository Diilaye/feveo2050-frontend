import React, { useState } from 'react';
import EnregistrementGIE from '../components/EnregistrementGIE';

const EnregistrementPage: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = (gie: any) => {
    setSuccessMessage(
      `Votre GIE "${gie.nomGIE}" a été enregistré avec succès! ` +
      `Identifiant: ${gie.identifiantGIE}. ` +
      `Vous recevrez un SMS avec les instructions de paiement.`
    );
    setErrorMessage(null);
    
    // Faire défiler vers le haut pour voir le message de succès
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    setSuccessMessage(null);
    
    // Faire défiler vers le haut pour voir le message d'erreur
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Adhésion à FEVEO 2050
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Enregistrez votre Groupement d'Intérêt Économique (GIE)
          </p>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Succès!</p>
                <p className="mt-1 text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Erreur!</p>
                <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'enregistrement */}
        <EnregistrementGIE 
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {/* Informations complémentaires */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Processus d'adhésion
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-medium text-gray-900">Enregistrement</h4>
              <p className="text-sm text-gray-600 mt-1">
                Remplissez et soumettez le formulaire d'enregistrement
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-medium text-gray-900">Validation</h4>
              <p className="text-sm text-gray-600 mt-1">
                Votre dossier est examiné et validé par notre équipe
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-medium text-gray-900">Paiement</h4>
              <p className="text-sm text-gray-600 mt-1">
                Effectuez le paiement pour finaliser votre adhésion
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Montant de l'adhésion</h4>
            <p className="text-blue-800 text-sm">
              Le montant de l'adhésion à FEVEO 2050 est de <strong>50 000 FCFA</strong>. 
              Ce montant permet de couvrir les frais d'enregistrement, de formation et d'accompagnement de votre GIE.
            </p>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <h4 className="font-medium text-green-900 mb-2">Avantages de l'adhésion</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Accès aux formations et accompagnements</li>
              <li>• Possibilité de financement de vos projets</li>
              <li>• Réseau de partenaires et opportunités commerciales</li>
              <li>• Support technique et conseil en gestion</li>
              <li>• Participation aux événements et salons professionnels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnregistrementPage;
