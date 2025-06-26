import React, { useState } from 'react';
import { Building, FileText, MapPin, User, Phone, Calendar, CreditCard, Download, ArrowLeft, CheckCircle } from 'lucide-react';

const AdhesionForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Identification GIE
    numeroAdhesion: '',
    codeRegion: '',
    codeDepartement: '',
    codeArrondissement: '',
    codeCommune: '',
    numeroListe: '',
    commune: '',
    arrondissement: '',
    departement: '',
    region: '',
    
    // Immatriculation
    immatricule: false,
    numeroRegistre: '',
    
    // Présidente
    presidenteNom: '',
    presidentePrenom: '',
    dateNaissance: '',
    cinNumero: '',
    cinDelivrance: '',
    cinValidite: '',
    telephone: '',
    
    // Activités
    agriculture: false,
    elevage: false,
    transformation: false,
    commerceDistribution: false,
    
    // Coordonnateur
    coordinateurNom: '',
    coordinateurMatricule: '',
    
    // Signatures
    dateSignature: new Date().toISOString().split('T')[0]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Données géographiques du Sénégal
  const regionsData = {
    '01': {
      nom: 'DAKAR',
      departements: {
        '011': {
          nom: 'DAKAR',
          arrondissements: {
            '0111': 'DAKAR PLATEAU',
            '0112': 'GRAND DAKAR',
            '0113': 'ALMADIES',
            '0114': 'PARCELLES ASSAINIES'
          }
        },
        '012': {
          nom: 'PIKINE',
          arrondissements: {
            '0121': 'NIAVES',
            '0122': 'PIKINE DAGOUDANE',
            '0123': 'THIAROYE'
          }
        },
        '013': {
          nom: 'RUFISQUE',
          arrondissements: {
            '0131': 'RUFISQUE EST',
            '0132': 'SANGALKAM',
            '0133': 'DIAMNIADIO'
          }
        },
        '014': {
          nom: 'GUEDIAWAYE',
          arrondissements: {
            '0141': 'WAKHINANE NIMZATT',
            '0142': 'SAM NOTAIRE'
          }
        },
        '015': {
          nom: 'KEUR MASSAR',
          arrondissements: {
            '0151': 'MALIKA',
            '0152': 'YEUMBEUL',
            '0153': 'JAXAAY'
          }
        }
      }
    },
    '02': {
      nom: 'ZIGUINCHOR',
      departements: {
        '021': {
          nom: 'BIGNONA',
          arrondissements: {
            '0211': 'SINDIAN',
            '0212': 'TENDOUCK',
            '0213': 'TENGHORY',
            '0214': 'KATABA I'
          }
        },
        '022': {
          nom: 'OUSSOUYE',
          arrondissements: {
            '0221': 'KABROUSSE',
            '0222': 'LOUDIA OUOLOF'
          }
        },
        '023': {
          nom: 'ZIGUINCHOR',
          arrondissements: {
            '0231': 'NIAGUIS',
            '0232': 'NYASSIA'
          }
        }
      }
    },
    '03': {
      nom: 'DIOURBEL',
      departements: {
        '031': {
          nom: 'BAMBEY',
          arrondissements: {
            '0311': 'BABA GARAGE',
            '0312': 'LAMBAYE',
            '0313': 'NGOYE'
          }
        },
        '032': {
          nom: 'DIOURBEL',
          arrondissements: {
            '0321': 'NDINDY',
            '0322': 'NDOULO'
          }
        },
        '033': {
          nom: 'M\'BACKE',
          arrondissements: {
            '0331': 'KAEL',
            '0332': 'NDAME',
            '0333': 'TAIF'
          }
        }
      }
    },
    '04': {
      nom: 'SAINT-LOUIS',
      departements: {
        '041': {
          nom: 'DAGANA',
          arrondissements: {
            '0411': 'MBANE',
            '0412': 'NDIAYE'
          }
        },
        '042': {
          nom: 'PODOR',
          arrondissements: {
            '0421': 'CAS-CAS',
            '0422': 'SALDE',
            '0423': 'THILLE BOUBACAR',
            '0424': 'GAMADJI SARE'
          }
        },
        '043': {
          nom: 'SAINT LOUIS',
          arrondissements: {
            '0431': 'RAO'
          }
        }
      }
    },
    '05': {
      nom: 'TAMBACOUNDA',
      departements: {
        '051': {
          nom: 'BAKEL',
          arrondissements: {
            '0511': 'KENIEBA',
            '0512': 'BELE',
            '0513': 'MOUDERY'
          }
        },
        '052': {
          nom: 'TAMBACOUNDA',
          arrondissements: {
            '0521': 'KOUSSANAR',
            '0522': 'MAKACOLIBANTANG',
            '0523': 'MISSIRAH'
          }
        },
        '053': {
          nom: 'GOUDIRY',
          arrondissements: {
            '0531': 'BALA',
            '0532': 'BOYNGUEL BAMBA',
            '0533': 'DIANKE MAKHA',
            '0534': 'KOULOR'
          }
        },
        '054': {
          nom: 'KOUPENTOUM',
          arrondissements: {
            '0541': 'BAMBA THIALENE',
            '0542': 'KOUTHIABA WOLOF'
          }
        }
      }
    },
    '06': {
      nom: 'KAOLACK',
      departements: {
        '061': {
          nom: 'KAOLACK',
          arrondissements: {
            '0611': 'NDIEDIENG',
            '0612': 'KOUMBAL',
            '0613': 'NGOTHIE'
          }
        },
        '062': {
          nom: 'NIORO',
          arrondissements: {
            '0621': 'MEDINA-SABAKH',
            '0622': 'PAOSKOTO',
            '0623': 'WACK-NGOUNA'
          }
        },
        '063': {
          nom: 'GUINGUINEO',
          arrondissements: {
            '0631': 'MBADAKHOUNE',
            '0632': 'NGUELOU'
          }
        }
      }
    },
    '07': {
      nom: 'THIES',
      departements: {
        '071': {
          nom: 'M\'BOUR',
          arrondissements: {
            '0711': 'FISSEL',
            '0712': 'SESSENE',
            '0713': 'SINDIA'
          }
        },
        '072': {
          nom: 'THIES',
          arrondissements: {
            '0721': 'NOTTO',
            '0722': 'THIES NORD',
            '0723': 'THIENABA',
            '0724': 'THIES SUD',
            '0725': 'KEUR MOUSSA'
          }
        },
        '073': {
          nom: 'TIVAOUANE',
          arrondissements: {
            '0731': 'MEOUANE',
            '0732': 'MERINA-DAKHAR',
            '0733': 'NIAKHENE',
            '0734': 'PAMBAL'
          }
        }
      }
    },
    '08': {
      nom: 'LOUGA',
      departements: {
        '081': {
          nom: 'KEBEMER',
          arrondissements: {
            '0811': 'DAROU MOUSTY',
            '0812': 'NDANDE',
            '0813': 'SAGATTA GUETH'
          }
        },
        '082': {
          nom: 'LINGUERE',
          arrondissements: {
            '0821': 'BARKEDJI',
            '0822': 'DODJI',
            '0823': 'YANG YANG',
            '0824': 'SAGATTA DJOLOF'
          }
        },
        '083': {
          nom: 'LOUGA',
          arrondissements: {
            '0831': 'COKI',
            '0832': 'KEUR MOMAR SARR',
            '0833': 'MBEDIENE',
            '0834': 'SAKAL'
          }
        }
      }
    },
    '09': {
      nom: 'FATICK',
      departements: {
        '091': {
          nom: 'FATICK',
          arrondissements: {
            '0911': 'NDIOB',
            '0912': 'FIMELA',
            '0913': 'NIAKHAR',
            '0914': 'TATTAGUINE'
          }
        },
        '092': {
          nom: 'FOUNDIOUGNE',
          arrondissements: {
            '0921': 'DJILOR',
            '0922': 'NIODIOR',
            '0923': 'TOUBACOUTA'
          }
        },
        '093': {
          nom: 'GOSSAS',
          arrondissements: {
            '0931': 'COLOBANE',
            '0932': 'OUADIOUR'
          }
        }
      }
    },
    '10': {
      nom: 'KOLDA',
      departements: {
        '101': {
          nom: 'KOLDA',
          arrondissements: {
            '1011': 'DIOULACOLON',
            '1012': 'MAMPATIM',
            '1013': 'SARE BIDJI'
          }
        },
        '102': {
          nom: 'VELINGARA',
          arrondissements: {
            '1021': 'BONCONTO',
            '1022': 'PAKOUR',
            '1023': 'SARE COLY SALLE'
          }
        },
        '103': {
          nom: 'MEDINA YORO FOULAH',
          arrondissements: {
            '1031': 'FAFACOUROU',
            '1032': 'NDORNA',
            '1033': 'NIAMING'
          }
        }
      }
    },
    '11': {
      nom: 'MATAM',
      departements: {
        '111': {
          nom: 'MATAM',
          arrondissements: {
            '1111': 'AGNAM-CIVOL',
            '1112': 'OGO'
          }
        },
        '112': {
          nom: 'KANEL',
          arrondissements: {
            '1121': 'ORKADIERE',
            '1122': 'OURO SIDY'
          }
        },
        '113': {
          nom: 'RANEROU',
          arrondissements: {
            '1131': 'VELINGARA'
          }
        }
      }
    },
    '12': {
      nom: 'KAFFRINE',
      departements: {
        '121': {
          nom: 'KAFFRINE',
          arrondissements: {
            '1211': 'GNIBY',
            '1212': 'KATAKEL'
          }
        },
        '122': {
          nom: 'BIRKELANE',
          arrondissements: {
            '1221': 'KEUR M\'BOUKI',
            '1222': 'MABO'
          }
        },
        '123': {
          nom: 'KOUNGHEUL',
          arrondissements: {
            '1231': 'IDA MOURIDE',
            '1232': 'LOUR ESCALE',
            '1233': 'MISSIRAH WADENE'
          }
        },
        '124': {
          nom: 'MALEM HODDAR',
          arrondissements: {
            '1241': 'DAROU MINAM II',
            '1242': 'SAGHA'
          }
        }
      }
    },
    '13': {
      nom: 'KEDOUGOU',
      departements: {
        '131': {
          nom: 'KEDOUGOU',
          arrondissements: {
            '1311': 'BANDAFASSI',
            '1312': 'FONGOLEMBI'
          }
        },
        '132': {
          nom: 'SALEMATA',
          arrondissements: {
            '1321': 'DAKATELI',
            '1322': 'DAR SALAM'
          }
        },
        '133': {
          nom: 'SARAYA',
          arrondissements: {
            '1331': 'BEMBOU',
            '1332': 'SABODOLA'
          }
        }
      }
    },
    '14': {
      nom: 'SEDHIOU',
      departements: {
        '141': {
          nom: 'SEDHIOU',
          arrondissements: {
            '1411': 'DIENDE',
            '1412': 'DJIBABOUYA',
            '1413': 'DJIREDJI'
          }
        },
        '142': {
          nom: 'BOUNKILING',
          arrondissements: {
            '1421': 'BOGHAL',
            '1422': 'BONA',
            '1423': 'DIAROUME'
          }
        },
        '143': {
          nom: 'GOUDOMP',
          arrondissements: {
            '1431': 'DJIBANAR',
            '1432': 'KARANTABA',
            '1433': 'SIMBANDI BRASSOU'
          }
        }
      }
    }
  };

  const generateGIECode = () => {
    if (formData.codeRegion && formData.codeDepartement && formData.codeArrondissement && formData.codeCommune && formData.numeroListe) {
      return `FEVEO${formData.codeRegion}${formData.codeDepartement}${formData.codeArrondissement}${formData.codeCommune}${formData.numeroListe.padStart(3, '0')}`;
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-remplissage des noms géographiques
      if (field === 'codeRegion') {
        const region = regionsData[value];
        newData.region = region ? region.nom : '';
        newData.codeDepartement = '';
        newData.departement = '';
        newData.codeArrondissement = '';
        newData.arrondissement = '';
        newData.codeCommune = '';
        newData.commune = '';
      } else if (field === 'codeDepartement') {
        const region = regionsData[newData.codeRegion];
        const departement = region?.departements[value];
        newData.departement = departement ? departement.nom : '';
        newData.codeArrondissement = '';
        newData.arrondissement = '';
        newData.codeCommune = '';
        newData.commune = '';
      } else if (field === 'codeArrondissement') {
        const region = regionsData[newData.codeRegion];
        const departement = region?.departements[newData.codeDepartement];
        const arrondissement = departement?.arrondissements[value];
        newData.arrondissement = arrondissement || '';
        newData.codeCommune = '';
        newData.commune = '';
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.codeRegion) newErrors.codeRegion = 'Région requise';
        if (!formData.codeDepartement) newErrors.codeDepartement = 'Département requis';
        if (!formData.codeArrondissement) newErrors.codeArrondissement = 'Arrondissement requis';
        if (!formData.numeroListe) newErrors.numeroListe = 'Numéro de liste requis';
        break;
      case 2:
        if (!formData.presidenteNom.trim()) newErrors.presidenteNom = 'Nom requis';
        if (!formData.presidentePrenom.trim()) newErrors.presidentePrenom = 'Prénom requis';
        if (!formData.dateNaissance) newErrors.dateNaissance = 'Date de naissance requise';
        if (!formData.cinNumero.trim()) newErrors.cinNumero = 'Numéro CIN requis';
        if (!formData.telephone.trim()) newErrors.telephone = 'Téléphone requis';
        break;
      case 3:
        if (!formData.agriculture && !formData.elevage && !formData.transformation && !formData.commerceDistribution) {
          newErrors.activites = 'Au moins une activité doit être sélectionnée';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log('Formulaire soumis:', formData);
      // Ici vous ajouteriez la logique de soumission
    }
  };

  const steps = [
    { id: 1, title: 'Localisation GIE', icon: MapPin },
    { id: 2, title: 'Présidente', icon: User },
    { id: 3, title: 'Activités', icon: Building },
    { id: 4, title: 'Finalisation', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-neutral-100 py-8">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-neutral-600 hover:text-accent-500 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Demande d'Adhésion FEVEO 2050</h1>
            <p className="text-neutral-600">Plateforme d'investissement économie organique</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-accent-500 text-neutral-50' 
                    : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
                }`}>
                  <step.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-accent-500' : 'bg-neutral-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Localisation */}
          {currentStep === 1 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <MapPin className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Localisation du GIE</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Région *
                  </label>
                  <select
                    value={formData.codeRegion}
                    onChange={(e) => handleInputChange('codeRegion', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.codeRegion ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Sélectionnez la région</option>
                    {Object.entries(regionsData).map(([code, region]) => (
                      <option key={code} value={code}>{code} - {region.nom}</option>
                    ))}
                  </select>
                  {errors.codeRegion && <p className="text-red-500 text-sm mt-1">{errors.codeRegion}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Département *
                  </label>
                  <select
                    value={formData.codeDepartement}
                    onChange={(e) => handleInputChange('codeDepartement', e.target.value)}
                    disabled={!formData.codeRegion}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.codeDepartement ? 'border-red-300' : 'border-neutral-300'
                    } ${!formData.codeRegion ? 'bg-neutral-100' : ''}`}
                  >
                    <option value="">Sélectionnez le département</option>
                    {formData.codeRegion && Object.entries(regionsData[formData.codeRegion]?.departements || {}).map(([code, dept]) => (
                      <option key={code} value={code}>{code} - {dept.nom}</option>
                    ))}
                  </select>
                  {errors.codeDepartement && <p className="text-red-500 text-sm mt-1">{errors.codeDepartement}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Arrondissement *
                  </label>
                  <select
                    value={formData.codeArrondissement}
                    onChange={(e) => handleInputChange('codeArrondissement', e.target.value)}
                    disabled={!formData.codeDepartement}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.codeArrondissement ? 'border-red-300' : 'border-neutral-300'
                    } ${!formData.codeDepartement ? 'bg-neutral-100' : ''}`}
                  >
                    <option value="">Sélectionnez l'arrondissement</option>
                    {formData.codeDepartement && Object.entries(regionsData[formData.codeRegion]?.departements[formData.codeDepartement]?.arrondissements || {}).map(([code, arr]) => (
                      <option key={code} value={code}>{code} - {arr}</option>
                    ))}
                  </select>
                  {errors.codeArrondissement && <p className="text-red-500 text-sm mt-1">{errors.codeArrondissement}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Code Commune
                  </label>
                  <input
                    type="text"
                    value={formData.codeCommune}
                    onChange={(e) => handleInputChange('codeCommune', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Code commune (optionnel)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Numéro de liste d'adhésion *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formData.numeroListe}
                    onChange={(e) => handleInputChange('numeroListe', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.numeroListe ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Numéro d'ordre dans la commune"
                  />
                  {errors.numeroListe && <p className="text-red-500 text-sm mt-1">{errors.numeroListe}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom de la commune
                  </label>
                  <input
                    type="text"
                    value={formData.commune}
                    onChange={(e) => handleInputChange('commune', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Nom de la commune"
                  />
                </div>
              </div>

              {/* Code GIE généré */}
              {generateGIECode() && (
                <div className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200">
                  <h4 className="font-semibold text-accent-800 mb-2">Code GIE généré :</h4>
                  <p className="text-2xl font-mono font-bold text-accent-600">{generateGIECode()}</p>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button onClick={handleNext} className="btn-accent px-8 py-3">
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Présidente */}
          {currentStep === 2 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <User className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Informations de la Présidente</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.presidenteNom}
                    onChange={(e) => handleInputChange('presidenteNom', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.presidenteNom ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Nom de famille"
                  />
                  {errors.presidenteNom && <p className="text-red-500 text-sm mt-1">{errors.presidenteNom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.presidentePrenom}
                    onChange={(e) => handleInputChange('presidentePrenom', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.presidentePrenom ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Prénom(s)"
                  />
                  {errors.presidentePrenom && <p className="text-red-500 text-sm mt-1">{errors.presidentePrenom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.dateNaissance ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  />
                  {errors.dateNaissance && <p className="text-red-500 text-sm mt-1">{errors.dateNaissance}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Numéro CIN *
                  </label>
                  <input
                    type="text"
                    value={formData.cinNumero}
                    onChange={(e) => handleInputChange('cinNumero', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.cinNumero ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Numéro de la carte d'identité"
                  />
                  {errors.cinNumero && <p className="text-red-500 text-sm mt-1">{errors.cinNumero}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date de délivrance CIN
                  </label>
                  <input
                    type="date"
                    value={formData.cinDelivrance}
                    onChange={(e) => handleInputChange('cinDelivrance', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date de validité CIN
                  </label>
                  <input
                    type="date"
                    value={formData.cinValidite}
                    onChange={(e) => handleInputChange('cinValidite', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Téléphone et PAYMASTER *
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${
                      errors.telephone ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="+221 XX XXX XX XX"
                  />
                  {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                </div>
              </div>

              {/* Immatriculation */}
              <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-semibold text-neutral-900 mb-4">Immatriculation au Registre de Commerce</h4>
                <div className="flex items-center space-x-6 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="immatriculation"
                      checked={formData.immatricule}
                      onChange={() => handleInputChange('immatricule', true)}
                      className="mr-2"
                    />
                    Immatriculé
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="immatriculation"
                      checked={!formData.immatricule}
                      onChange={() => handleInputChange('immatricule', false)}
                      className="mr-2"
                    />
                    Non immatriculé
                  </label>
                </div>
                {formData.immatricule && (
                  <input
                    type="text"
                    value={formData.numeroRegistre}
                    onChange={(e) => handleInputChange('numeroRegistre', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Numéro de registre de commerce"
                  />
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentStep(1)} 
                  className="btn-secondary px-8 py-3"
                >
                  Retour
                </button>
                <button onClick={handleNext} className="btn-accent px-8 py-3">
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Activités */}
          {currentStep === 3 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <Building className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Activités du GIE</h3>
              </div>

              <p className="text-neutral-600 mb-6">
                Sélectionnez les activités dans lesquelles votre GIE souhaite s'engager :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.agriculture}
                    onChange={(e) => handleInputChange('agriculture', e.target.checked)}
                    className="mr-4 w-5 h-5 text-accent-500"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Agriculture</h4>
                    <p className="text-sm text-neutral-600">Production agricole et maraîchère</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.elevage}
                    onChange={(e) => handleInputChange('elevage', e.target.checked)}
                    className="mr-4 w-5 h-5 text-accent-500"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Élevage</h4>
                    <p className="text-sm text-neutral-600">Élevage de bétail et volaille</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.transformation}
                    onChange={(e) => handleInputChange('transformation', e.target.checked)}
                    className="mr-4 w-5 h-5 text-accent-500"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Transformation</h4>
                    <p className="text-sm text-neutral-600">Transformation des produits agricoles</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.commerceDistribution}
                    onChange={(e) => handleInputChange('commerceDistribution', e.target.checked)}
                    className="mr-4 w-5 h-5 text-accent-500"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Commerce et Distribution</h4>
                    <p className="text-sm text-neutral-600">Vente et distribution de produits</p>
                  </div>
                </label>
              </div>

              {errors.activites && <p className="text-red-500 text-sm mt-4">{errors.activites}</p>}

              {/* Coordonnateur */}
              <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-semibold text-neutral-900 mb-4">Coordonnateur d'enrôlement</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.coordinateurNom}
                    onChange={(e) => handleInputChange('coordinateurNom', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Nom du coordonnateur"
                  />
                  <input
                    type="text"
                    value={formData.coordinateurMatricule}
                    onChange={(e) => handleInputChange('coordinateurMatricule', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="Matricule (C.ENR.XXX)"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentStep(2)} 
                  className="btn-secondary px-8 py-3"
                >
                  Retour
                </button>
                <button onClick={handleNext} className="btn-accent px-8 py-3">
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Finalisation */}
          {currentStep === 4 && (
            <div className="card">
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-accent-500 mr-3" />
                <h3 className="text-2xl font-bold text-neutral-900">Finalisation de la demande</h3>
              </div>

              {/* Récapitulatif */}
              <div className="bg-neutral-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-neutral-900 mb-4">Récapitulatif de la demande</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Code GIE</h5>
                    <p className="text-lg font-mono font-bold text-accent-600">{generateGIECode()}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Localisation</h5>
                    <p className="text-neutral-900">
                      {formData.commune && `${formData.commune}, `}
                      {formData.arrondissement && `${formData.arrondissement}, `}
                      {formData.departement && `${formData.departement}, `}
                      {formData.region}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Présidente</h5>
                    <p className="text-neutral-900">{formData.presidentePrenom} {formData.presidenteNom}</p>
                    <p className="text-sm text-neutral-600">{formData.telephone}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-neutral-700 mb-2">Activités</h5>
                    <div className="flex flex-wrap gap-2">
                      {formData.agriculture && <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-sm">Agriculture</span>}
                      {formData.elevage && <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-sm">Élevage</span>}
                      {formData.transformation && <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-sm">Transformation</span>}
                      {formData.commerceDistribution && <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-sm">Commerce</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frais */}
              <div className="bg-accent-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-accent-800 mb-4">Frais d'adhésion</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between items-center">
                    <span className="text-accent-700">Droits d'adhésion :</span>
                    <span className="font-bold text-accent-800">20 000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-accent-700">Actions d'investissement :</span>
                    <span className="font-bold text-accent-800">60 000 FCFA</span>
                  </div>
                  <div className="md:col-span-2 border-t border-accent-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-accent-800">Total :</span>
                      <span className="text-2xl font-bold text-accent-800">80 000 FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date de signature */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date de signature
                </label>
                <input
                  type="date"
                  value={formData.dateSignature}
                  onChange={(e) => handleInputChange('dateSignature', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                />
              </div>

              {/* Signatures */}
              <div className="bg-neutral-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-neutral-900 mb-4">Signatures requises</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-neutral-500 text-sm">Signature Présidente</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-700">Présidente</p>
                  </div>
                  <div className="text-center">
                    <div className="h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-neutral-500 text-sm">Signature Secrétaire</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-700">Secrétaire Générale</p>
                  </div>
                  <div className="text-center">
                    <div className="h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-neutral-500 text-sm">Signature Trésorière</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-700">Trésorière</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setCurrentStep(3)} 
                  className="btn-secondary px-8 py-3"
                >
                  Retour
                </button>
                <div className="flex space-x-4">
                  <button className="btn-secondary px-6 py-3">
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger PDF
                  </button>
                  <button onClick={handleSubmit} className="btn-success px-8 py-3">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Soumettre la demande
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdhesionForm;