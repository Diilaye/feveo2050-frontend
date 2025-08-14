import React from 'react';
import {
  Users,
  Activity,
  UserPlus,
  Plus,
  Edit,
  Trash2,
  X,
  Save
} from 'lucide-react';

interface Member {
  _id?: string;
  nom: string;
  prenom: string;
  telephone: string;
  fonction?: string;
  genre?: string;
  cin?: string;
  dateAjout?: string;
  profession?: string;
  adresse?: string;
}

interface MembersSectionProps {
  membres: Member[];
  membresLoading: boolean;
  membresStats: any;
  showAddMemberModal: boolean;
  showEditMemberModal: boolean;
  selectedMember: Member | null;
  memberForm: any;
  setShowAddMemberModal: (show: boolean) => void;
  setShowEditMemberModal: (show: boolean) => void;
  setMemberForm: (form: any) => void;
  handleAddMember: (e: React.FormEvent) => void;
  handleEditMember: (e: React.FormEvent) => void;
  handleDeleteMember: (member: Member) => void;
  openEditModal: (member: Member) => void;
  resetMemberForm: () => void;
  loadMembres: () => void;
}

const MembersSection: React.FC<MembersSectionProps> = ({
  membres,
  membresLoading,
  membresStats,
  showAddMemberModal,
  showEditMemberModal,
  selectedMember,
  memberForm,
  setShowAddMemberModal,
  setShowEditMemberModal,
  setMemberForm,
  handleAddMember,
  handleEditMember,
  handleDeleteMember,
  openEditModal,
  resetMemberForm,
  loadMembres
}) => {
  return (
    <>
      {/* En-tête de la page membres */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">Gestion des Membres</h3>
          <p className="text-purple-100">Gérez les membres de votre GIE (max 40 membres)</p>
        </div>
      </div>

      {/* Statistiques des membres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Total Membres</h4>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{membres.length}</p>
          <p className="text-xs text-gray-600 mt-1">sur 40 max</p>
        </div>

        

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Places Disponibles</h4>
            <UserPlus className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{40 - membres.length}</p>
          <p className="text-xs text-green-600 mt-1">
            {membres.length >= 40 ? 'Limite atteinte' : 'Places libres'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Nouveaux Membres</h4>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {membresStats?.dernierAjout ? '1' : '0'}
          </p>
          <p className="text-xs text-gray-600 mt-1">Ce mois-ci</p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button 
          onClick={() => setShowAddMemberModal(true)}
          disabled={membres.length >= 40}
          className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
            membres.length >= 40 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un Membre {membres.length >= 40 && '(Limite atteinte)'}
        </button>
        
        <button 
          onClick={() => loadMembres()}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Activity className="w-5 h-5 mr-2" />
          Actualiser
        </button>
      </div>

      {/* Liste des membres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Liste des Membres</h3>
            <div className="flex items-center space-x-4">
              {membresLoading && (
                <div className="text-blue-600 text-sm flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Chargement...
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fonction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {membres.length === 0 && !membresLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Aucun membre trouvé</p>
                    <p className="text-sm">Commencez par ajouter votre premier membre</p>
                  </td>
                </tr>
              ) : (
                membres.map((membre, index) => (
                  <tr key={membre._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {membre.prenom?.charAt(0)}{membre.nom?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {membre.prenom} {membre.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {membre.dateAjout ? new Date(membre.dateAjout).toLocaleDateString('fr-FR') : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        membre.fonction === 'Présidente' || membre.fonction === 'Président'
                          ? 'bg-purple-100 text-purple-800'
                          : membre.fonction === 'Vice-Président' || membre.fonction === 'Vice-Présidente'
                          ? 'bg-blue-100 text-blue-800'
                          : membre.fonction === 'Trésorière' || membre.fonction === 'Trésorier'
                          ? 'bg-green-100 text-green-800'
                          : membre.fonction === 'Secrétaire'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {membre.fonction || 'Membre'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-gray-600">{membre.telephone}</span>
                        </div>
                        {membre.profession && (
                          <div className="text-gray-500 text-xs">{membre.profession}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {membre.genre ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          membre.genre.toLowerCase() === 'femme' || membre.genre.toLowerCase() === 'f'
                            ? 'bg-pink-100 text-pink-800'
                            : membre.genre.toLowerCase() === 'homme' || membre.genre.toLowerCase() === 'h'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {membre.genre}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {membre.cin || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openEditModal(membre)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(membre)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout de membre */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un nouveau membre</h3>
              <button 
                onClick={() => {
                  setShowAddMemberModal(false);
                  resetMemberForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.nom}
                    onChange={(e) => setMemberForm({...memberForm, nom: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de famille"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.prenom}
                    onChange={(e) => setMemberForm({...memberForm, prenom: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Prénom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={memberForm.telephone}
                    onChange={(e) => setMemberForm({...memberForm, telephone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+221 77 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fonction
                  </label>
                  <select
                    value={memberForm.fonction}
                    onChange={(e) => setMemberForm({...memberForm, fonction: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Membre">Membre</option>
                    <option value="Président">Président</option>
                    <option value="Présidente">Présidente</option>
                    <option value="Vice-Président">Vice-Président</option>
                    <option value="Vice-Présidente">Vice-Présidente</option>
                    <option value="Trésorier">Trésorier</option>
                    <option value="Trésorière">Trésorière</option>
                    <option value="Secrétaire">Secrétaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    value={memberForm.genre}
                    onChange={(e) => setMemberForm({...memberForm, genre: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CIN
                  </label>
                  <input
                    type="text"
                    value={memberForm.cin}
                    onChange={(e) => setMemberForm({...memberForm, cin: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Numéro CIN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={memberForm.dateNaissance}
                    onChange={(e) => setMemberForm({...memberForm, dateNaissance: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={memberForm.profession}
                    onChange={(e) => setMemberForm({...memberForm, profession: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Profession ou métier"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  value={memberForm.adresse}
                  onChange={(e) => setMemberForm({...memberForm, adresse: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Adresse complète"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    resetMemberForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Ajouter le membre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification de membre */}
      {showEditMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Modifier {selectedMember.prenom} {selectedMember.nom}
              </h3>
              <button 
                onClick={() => {
                  setShowEditMemberModal(false);
                  resetMemberForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.nom}
                    onChange={(e) => setMemberForm({...memberForm, nom: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.prenom}
                    onChange={(e) => setMemberForm({...memberForm, prenom: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={memberForm.telephone}
                    onChange={(e) => setMemberForm({...memberForm, telephone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fonction
                  </label>
                  <select
                    value={memberForm.fonction}
                    onChange={(e) => setMemberForm({...memberForm, fonction: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Membre">Membre</option>
                    <option value="Président">Président</option>
                    <option value="Présidente">Présidente</option>
                    <option value="Vice-Président">Vice-Président</option>
                    <option value="Vice-Présidente">Vice-Présidente</option>
                    <option value="Trésorier">Trésorier</option>
                    <option value="Trésorière">Trésorière</option>
                    <option value="Secrétaire">Secrétaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    value={memberForm.genre}
                    onChange={(e) => setMemberForm({...memberForm, genre: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CIN
                  </label>
                  <input
                    type="text"
                    value={memberForm.cin}
                    onChange={(e) => setMemberForm({...memberForm, cin: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={memberForm.dateNaissance}
                    onChange={(e) => setMemberForm({...memberForm, dateNaissance: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={memberForm.profession}
                    onChange={(e) => setMemberForm({...memberForm, profession: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  value={memberForm.adresse}
                  onChange={(e) => setMemberForm({...memberForm, adresse: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditMemberModal(false);
                    resetMemberForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MembersSection;
