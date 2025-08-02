import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface PaiementFormProps {
  montant: number;
  typePaiement: 'adhesion_gie' | 'investissement' | 'cotisation' | 'service' | 'autre';
  entiteId: string;
  typeEntite: 'GIE' | 'CycleInvestissement' | 'Adhesion' | 'Utilisateur';
  onSuccess?: (paiement: any) => void;
  onError?: (error: string) => void;
}

const PaiementForm: React.FC<PaiementFormProps> = ({
  montant,
  typePaiement,
  entiteId,
  typeEntite,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [payeur, setPayeur] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });
  const [methodePaiement, setMethodePaiement] = useState<'wave' | 'orange_money' | 'free_money'>('wave');
  const [accepterConditions, setAccepterConditions] = useState(false);

  // Pré-remplir avec les données utilisateur si disponibles
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setPayeur({
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || '',
        email: user.email || ''
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accepterConditions) {
      onError?.('Vous devez accepter les conditions de paiement');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://api.feveo2025.sn/api/paiements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          montant,
          typePaiement,
          entiteId,
          typeEntite,
          payeur,
          methodePaiement,
          metadonnees: {
            source: 'frontend_feveo'
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.urlPaiement) {
          // Rediriger vers la page de paiement Wave
          window.location.href = data.data.urlPaiement;
        } else {
          onSuccess?.(data.data.paiement);
        }
      } else {
        onError?.(data.message || 'Erreur lors de la création du paiement');
      }
    } catch (error) {
      onError?.('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Paiement sécurisé</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Montant à payer */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Montant à payer:</span>
            <span className="text-2xl font-bold text-blue-600">
              {montant.toLocaleString()} XOF
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Type: {typePaiement.replace('_', ' ')}
          </div>
        </div>

        {/* Méthode de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de paiement
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="wave"
                checked={methodePaiement === 'wave'}
                onChange={(e) => setMethodePaiement(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm">Wave Money</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="orange_money"
                checked={methodePaiement === 'orange_money'}
                onChange={(e) => setMethodePaiement(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm">Orange Money</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="free_money"
                checked={methodePaiement === 'free_money'}
                onChange={(e) => setMethodePaiement(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm">Free Money</span>
            </label>
          </div>
        </div>

        {/* Informations du payeur */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              required
              value={payeur.prenom}
              onChange={(e) => setPayeur({ ...payeur, prenom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              required
              value={payeur.nom}
              onChange={(e) => setPayeur({ ...payeur, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            required
            placeholder="77 123 45 67"
            value={payeur.telephone}
            onChange={(e) => setPayeur({ ...payeur, telephone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={payeur.email}
            onChange={(e) => setPayeur({ ...payeur, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="conditions"
            checked={accepterConditions}
            onChange={(e) => setAccepterConditions(e.target.checked)}
            className="mt-1 mr-2"
          />
          <label htmlFor="conditions" className="text-sm text-gray-600">
            J'accepte les conditions de paiement et autorise le prélèvement du montant indiqué
          </label>
        </div>

        {/* Bouton de paiement */}
        <button
          type="submit"
          disabled={loading || !accepterConditions}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              Traitement...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Payer {montant.toLocaleString()} XOF
            </>
          )}
        </button>
      </form>

      {/* Informations de sécurité */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          Paiement sécurisé par Wave
        </div>
      </div>
    </div>
  );
};

export default PaiementForm;
