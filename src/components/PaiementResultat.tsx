import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const PaiementResultat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paiement, setPaiement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reference = searchParams.get('ref');
  const statut = searchParams.get('status'); // success, error, cancel

  useEffect(() => {
    if (reference) {
      verifierPaiement();
    } else {
      setError('Référence de paiement manquante');
      setLoading(false);
    }
  }, [reference]);

  const verifierPaiement = async () => {
    try {
      const response = await fetch(`https://api.feveo2025.sn/api/paiements/reference/${reference}`);
      const data = await response.json();

      if (data.success) {
        setPaiement(data.data.paiement);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors de la vérification du paiement');
    } finally {
      setLoading(false);
    }
  };

  const retourAccueil = () => {
    navigate('/');
  };

  const voirHistorique = () => {
    navigate('/paiements');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification du paiement en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={retourAccueil}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const estReussi = paiement?.statut === 'reussi';
  const estEchoue = paiement?.statut === 'echoue';
  const estAnnule = paiement?.statut === 'annule';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          {/* Icône selon le statut */}
          {estReussi && (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          )}
          {(estEchoue || estAnnule) && (
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          {!estReussi && !estEchoue && !estAnnule && (
            <RefreshCw className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          )}

          {/* Titre selon le statut */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {estReussi && 'Paiement réussi !'}
            {estEchoue && 'Paiement échoué'}
            {estAnnule && 'Paiement annulé'}
            {!estReussi && !estEchoue && !estAnnule && 'Paiement en cours'}
          </h1>

          {/* Message selon le statut */}
          <p className="text-gray-600 mb-6">
            {estReussi && 'Votre paiement a été traité avec succès.'}
            {estEchoue && 'Une erreur est survenue lors du traitement de votre paiement.'}
            {estAnnule && 'Votre paiement a été annulé.'}
            {!estReussi && !estEchoue && !estAnnule && 'Votre paiement est en cours de traitement.'}
          </p>

          {/* Détails du paiement */}
          {paiement && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-3">Détails du paiement</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence:</span>
                  <span className="font-mono">{paiement.referencePaiement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-semibold">
                    {paiement.montant.toLocaleString()} {paiement.devise}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span>{paiement.typePaiement.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode:</span>
                  <span>{paiement.methodePaiement}</span>
                </div>
                {paiement.datePaiement && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date de paiement:</span>
                    <span>
                      {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages spécifiques */}
          {estReussi && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                Un email de confirmation vous a été envoyé à {paiement?.payeur?.email}
              </p>
            </div>
          )}

          {estEchoue && paiement?.messageErreur && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">
                Erreur: {paiement.messageErreur}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {estReussi && (
              <>
                <button
                  onClick={voirHistorique}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Voir l'historique des paiements
                </button>
                <button
                  onClick={retourAccueil}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Retour à l'accueil
                </button>
              </>
            )}

            {(estEchoue || estAnnule) && (
              <>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Réessayer le paiement
                </button>
                <button
                  onClick={retourAccueil}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Retour à l'accueil
                </button>
              </>
            )}

            {!estReussi && !estEchoue && !estAnnule && (
              <>
                <button
                  onClick={verifierPaiement}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Vérifier à nouveau
                </button>
                <button
                  onClick={retourAccueil}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Retour à l'accueil
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaiementResultat;
