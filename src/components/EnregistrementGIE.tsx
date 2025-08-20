import React, { useState } from 'react';
import { gieService, EnregistrementGIEData } from '../services/gieService';

interface EnregistrementGIEProps {
  onSuccess?: (gie: any) => void;
  onError?: (error: string) => void;
}

const EnregistrementGIE: React.FC<EnregistrementGIEProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<EnregistrementGIEData>({
    identifiantGIE: '',
    numeroProtocole: '',
    nomGIE: '',
    presidenteNom: '',
    presidentePrenom: '',
    presidenteTelephone: '',
    presidenteCIN: '',
    presidenteEmail: '',
    presidenteAdresse: '',
    region: '',
    departement: '',
    arrondissement: '',
    commune: '',
    // Ajout des codes manquants requis par le type EnregistrementGIEData
    codeRegion: '',
    codeDepartement: '',
    codeArrondissement: '',
    codeCommune: '',
    secteurPrincipal: '',
    objectifs: '', // String au lieu d'array
    activites: [],
    dateConstitution: '',
    nombreMembres: 1,
    membres: [],
    adresse: '',
    secteurActivite: '',
    description: '',
    besoinsFinancement: 0
  });

  // État local pour gérer la sélection multiple des objectifs comme array
  const [objectifsSelectionnes, setObjectifsSelectionnes] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const secteursActivite = [
    'agriculture',
    'elevage',
    'peche',
    'artisanat',
    'commerce',
    'transformation',
    'services',
    'autre'
  ];

  const objectifsPossibles = [
    'Production',
    'Commerce',
    'Transformation',
    'Formation',
    'Crédit',
    'Épargne',
    'Solidarité',
    'Développement communautaire'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Mise à jour standard du champ
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value
      };
      
      // Si un des champs d'adresse administratifs est modifié, mettre à jour le code correspondant
      // Note: Cette logique est simplifiée - idéalement, vous devriez récupérer les vrais codes
      // à partir d'une API ou d'une liste prédéfinie basée sur la sélection
      if (name === 'region') {
        updatedData.codeRegion = value.substring(0, 2); // exemple simple: utilise les 2 premiers caractères
      } else if (name === 'departement') {
        updatedData.codeDepartement = value.substring(0, 2); // exemple simple
      } else if (name === 'arrondissement') {
        updatedData.codeArrondissement = value.substring(0, 2); // exemple simple
      } else if (name === 'commune') {
        updatedData.codeCommune = value.substring(0, 3); // exemple simple
      }
      
      return updatedData;
    });
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleObjectifChange = (objectif: string) => {
    const nouveauxObjectifs = objectifsSelectionnes.includes(objectif)
      ? objectifsSelectionnes.filter(obj => obj !== objectif)
      : [...objectifsSelectionnes, objectif];
    
    setObjectifsSelectionnes(nouveauxObjectifs);
    
    // Mettre à jour le formData avec la chaîne jointe
    setFormData(prev => ({
      ...prev,
      objectifs: nouveauxObjectifs.join(', ')
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomGIE.trim()) newErrors.nomGIE = 'Le nom du GIE est requis';
    if (!formData.presidenteNom.trim()) newErrors.presidenteNom = 'Le nom de la présidente est requis';
    if (!formData.presidenteTelephone.trim()) newErrors.presidenteTelephone = 'Le téléphone est requis';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.secteurActivite) newErrors.secteurActivite = 'Le secteur d\'activité est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (objectifsSelectionnes.length === 0) newErrors.objectifs = 'Au moins un objectif doit être sélectionné';
    if (formData.nombreMembres < 1) newErrors.nombreMembres = 'Le nombre de membres doit être supérieur à 0';
    if (formData.besoinsFinancement < 0) newErrors.besoinsFinancement = 'Les besoins de financement ne peuvent pas être négatifs';

    // Validation du format téléphone
    const phoneRegex = /^\+221[0-9]{9}$/;
    if (formData.presidenteTelephone && !phoneRegex.test(formData.presidenteTelephone)) {
      newErrors.presidenteTelephone = 'Format: +221XXXXXXXXX';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Appel du service d'enregistrement
      const gie = await gieService.enregistrerGIE(formData);
      if (onSuccess) {
        onSuccess(gie);
      }
      // Réinitialiser le formulaire
      setFormData({
        identifiantGIE: '',
        numeroProtocole: '',
        nomGIE: '',
        presidenteNom: '',
        presidentePrenom: '',
        presidenteTelephone: '',
        presidenteCIN: '',
        presidenteEmail: '',
        presidenteAdresse: '',
        region: '',
        departement: '',
        arrondissement: '',
        commune: '',
        // Ajout des codes manquants requis par le type EnregistrementGIEData
        codeRegion: '',
        codeDepartement: '',
        codeArrondissement: '',
        codeCommune: '',
        secteurPrincipal: '',
        objectifs: '',
        activites: [],
        dateConstitution: '',
        nombreMembres: 1,
        membres: [],
        adresse: '',
        secteurActivite: '',
        description: '',
        besoinsFinancement: 0
      });
      setObjectifsSelectionnes([]);
      setErrors({});
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de l\'enregistrement';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Enregistrement de votre GIE</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du GIE *
            </label>
            <input
              type="text"
              name="nomGIE"
              value={formData.nomGIE}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.nomGIE ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: GIE Femmes Unies"
            />
            {errors.nomGIE && <p className="text-red-500 text-xs mt-1">{errors.nomGIE}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la Présidente *
            </label>
            <input
              type="text"
              name="presidenteNom"
              value={formData.presidenteNom}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.presidenteNom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Aminata Diallo"
            />
            {errors.presidenteNom && <p className="text-red-500 text-xs mt-1">{errors.presidenteNom}</p>}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone *
            </label>
            <input
              type="tel"
              name="presidenteTelephone"
              value={formData.presidenteTelephone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.presidenteTelephone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+221781234567"
            />
            {errors.presidenteTelephone && <p className="text-red-500 text-xs mt-1">{errors.presidenteTelephone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de membres *
            </label>
            <input
              type="number"
              name="nombreMembres"
              value={formData.nombreMembres}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.nombreMembres ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nombreMembres && <p className="text-red-500 text-xs mt-1">{errors.nombreMembres}</p>}
          </div>
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse complète *
          </label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.adresse ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Quartier Medina, Dakar, Sénégal"
          />
          {errors.adresse && <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>}
        </div>

        {/* Secteur d'activité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secteur d'activité *
          </label>
          <select
            name="secteurActivite"
            value={formData.secteurActivite}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.secteurActivite ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez un secteur</option>
            {secteursActivite.map(secteur => (
              <option key={secteur} value={secteur}>
                {secteur.charAt(0).toUpperCase() + secteur.slice(1)}
              </option>
            ))}
          </select>
          {errors.secteurActivite && <p className="text-red-500 text-xs mt-1">{errors.secteurActivite}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description des activités *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Décrivez les activités principales de votre GIE..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Objectifs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objectifs du GIE *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {objectifsPossibles.map(objectif => (
              <label key={objectif} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={objectifsSelectionnes.includes(objectif)}
                  onChange={() => handleObjectifChange(objectif)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">{objectif}</span>
              </label>
            ))}
          </div>
          {errors.objectifs && <p className="text-red-500 text-xs mt-1">{errors.objectifs}</p>}
        </div>

        {/* Besoins de financement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Besoins de financement (FCFA)
          </label>
          <input
            type="number"
            name="besoinsFinancement"
            value={formData.besoinsFinancement}
            onChange={handleInputChange}
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.besoinsFinancement ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 500000"
          />
          {errors.besoinsFinancement && <p className="text-red-500 text-xs mt-1">{errors.besoinsFinancement}</p>}
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer le GIE'}
          </button>
        </div>
      </form>

      {/* Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Information :</strong> Après l'enregistrement, votre GIE sera en attente de validation de paiement. 
          Vous recevrez un SMS avec les instructions pour finaliser votre adhésion.
        </p>
      </div>
    </div>
  );
};

export default EnregistrementGIE;
