import React from 'react';
import { ArrowLeft, Target, Users, DollarSign, Globe, Building, Factory, Truck, Zap, TreePine, Construction, Droplets, Network, Award, CheckCircle } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

interface AboutProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onBack, onNavigate }) => {
  const budgetSectors = [
    { name: 'Agriculture', percentage: '23%', amount: '1 700 M€', amountCFA: '1 115 126 900 000 FCFA', icon: TreePine, color: 'bg-green-500' },
    { name: 'Urbanisme', percentage: '23,5%', amount: '1 750 M€', amountCFA: '1 147 924 750 000 FCFA', icon: Building, color: 'bg-blue-500' },
    { name: 'Constructions civiles', percentage: '15,25%', amount: '1 135 M€', amountCFA: '744 511 195 000 FCFA', icon: Construction, color: 'bg-orange-500' },
    { name: 'Bâtiments de services', percentage: '10,25%', amount: '1 700 M€', amountCFA: '1 115 126 900 000 FCFA', icon: Building, color: 'bg-purple-500' },
    { name: 'Énergie', percentage: '10%', amount: '745 M€', amountCFA: '488 687 965 000 FCFA', icon: Zap, color: 'bg-yellow-500' },
    { name: 'Eau & traitement', percentage: '8,25%', amount: '615 M€', amountCFA: '403 413 555 000 FCFA', icon: Droplets, color: 'bg-cyan-500' },
    { name: 'Infrastructures et technologies', percentage: '5%', amount: '468,750 M€', amountCFA: '307 479 843 750 FCFA', icon: Network, color: 'bg-indigo-500' },
    { name: 'Distribution hydraulique', percentage: '4,75%', amount: '760 M€', amountCFA: '295 180 650 000 FCFA', icon: Droplets, color: 'bg-teal-500' },
  ];

  const objectives = [
    {
      title: 'Production mondiale de qualité',
      description: 'Produire à partir du Sénégal des matières premières, produits manufacturiers et industriels de haute qualité compétitives destinés au marché mondial par la route maritime transatlantique',
      icon: Globe
    },
    {
      title: 'Nouvelle approche économique',
      description: 'Réécrire une nouvelle approche économique basée sur l\'éthique, le partage de connaissances, technologies et savoir-faire dans un cadre de partenariat mutuellement bénéfique',
      icon: Award
    },
    {
      title: 'Transformation systémique',
      description: 'Être le moteur de la transformation systémique de l\'économie du Sénégal par la substitution des importations et devenir la première force de contribution fiscale',
      icon: Target
    }
  ];

  const nexusStats = [
    { label: 'Équipe professionnelle', value: '340+', subtitle: 'membres' },
    { label: 'Effectif total', value: '2 400+', subtitle: 'unités d\'entreprises' },
    { label: 'Capital social', value: '5 Mds€', subtitle: 'en valeur' },
    { label: 'Entreprises en réseau', value: '100+', subtitle: 'candidats en expansion' },
  ];

  const revenueDistribution = [
    { entity: 'Nexus Group', percentage: '30%', description: 'Partenaire technique et financier - Apporte le modèle économique, technologies, infrastructures, expertises' },
    { entity: 'FEVEO SAS', percentage: '10%', description: 'Crédibilise le projet pays - Organisation centralisée et décentralisée, missions opérationnelles' },
    { entity: 'GIEs de femmes', percentage: '60%', description: 'Membres de la plateforme - Apportent le foncier, l\'épargne investissement, la grande distribution' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-neutral-900">
      {/* Header */}
      <Header onNavigate={onNavigate || (() => {})} />
       {/* Back Button */}
      <div className="container-max section-padding pt-8 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-200 hover:text-accent-400 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour à l'accueil</span>
        </button>
      </div>

      {/* Hero Title */}
      <div className="container-max section-padding py-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-50 mb-6">
            L'Initiative Globale
            <span className="block text-accent-400">NEXUS</span>
          </h1>
          <p className="text-xl text-neutral-200 leading-relaxed">
            Plans vastes de zones pour l'établissement de villes organiques avec FEVEO 2050
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="container-max section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-neutral-50/5 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/10 mb-16">
            <h2 className="text-3xl font-bold text-neutral-50 mb-6">Le Modèle BAOBAB</h2>
            <p className="text-lg text-neutral-200 leading-relaxed mb-6">
              L'Initiative globale Nexus est un modèle économique organique dénommé modèle « BAOBAB » pour un résultat anthropique d'utilités, avec de la précision (faits dérivés d'une intervention de l'humain ; dû à l'existence et à la présence d'humains).
            </p>
            <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-accent-400 mb-4">Investissement 2025-2035</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-lg text-neutral-50 font-semibold">7 000 000 000 €</p>
                  <p className="text-neutral-300">Somme minimale d'investissement</p>
                </div>
                <div>
                  <p className="text-lg text-neutral-50 font-semibold">4 591 699 000 000 FCFA</p>
                  <p className="text-neutral-300">Équivalent en francs CFA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qu'est-ce que l'économie organique */}
      <section className="container-max section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-8 text-center">
            Qu'est-ce que l'économie organique ?
          </h2>
          <p className="text-lg text-neutral-200 leading-relaxed text-center mb-12 max-w-4xl mx-auto">
            L'économie organique est un modèle économique d'interactions autonomes d'activités par un système opérationnel d'ingénierie économique et financière pour un résultat de précision qui s'appuie sur huit sous-secteurs interdépendants.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetSectors.map((sector, index) => (
              <div key={index} className="bg-neutral-50/5 backdrop-blur-sm rounded-xl p-6 border border-neutral-50/10 hover:bg-neutral-50/10 transition-all duration-300">
                <div className={`w-12 h-12 ${sector.color} rounded-lg flex items-center justify-center mb-4`}>
                  <sector.icon className="w-6 h-6 text-neutral-50" />
                </div>
                <h3 className="text-lg font-bold text-neutral-50 mb-2">{sector.name}</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-accent-400">{sector.percentage}</p>
                  <p className="text-sm text-neutral-300">{sector.amount}</p>
                  <p className="text-xs text-neutral-400">{sector.amountCFA}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nexus Group */}
      <section className="container-max section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-8 text-center">
            Qu'est-ce que Nexus Group ?
          </h2>
          
          <div className="bg-neutral-50/5 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/10 mb-12">
            <p className="text-lg text-neutral-200 leading-relaxed text-center mb-8">
              Le Groupe Nexus, c'est la passion, la compétence, le défi et l'engagement, dans le but précis de produire des planifications, des réalisations et des développements qui expriment le meilleur du potentiel de la nature et des valeurs humaines, à travers la science, la compétence et le partage opérationnel.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {nexusStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-2">{stat.value}</div>
                  <div className="text-neutral-50 font-medium mb-1">{stat.label}</div>
                  <div className="text-sm text-neutral-300">{stat.subtitle}</div>
                </div>
              ))}
            </div>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-neutral-50 mb-4">Structure organisationnelle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-neutral-200">Unité administrative - domaine des chefs de projet</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-neutral-200">Unité juridique</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-neutral-200">Unité économique et financière</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-neutral-200">Unité Technologies de l'information et modèles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEVEO 2050 */}
      <section className="container-max section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-8 text-center">
            Qu'est-ce que FEVEO 2050 ?
          </h2>
          
          <div className="bg-neutral-50/5 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/10 mb-12">
            <p className="text-lg text-neutral-200 leading-relaxed mb-6">
              FEVEO 2050 est une plateforme d'investissement économie organique qui structure les initiatives économiques et financières des GIEs de femmes (AVEC, ACEC, ACTIVITÉS AGRICOLES, MANUFACTURIERES ET COMMERCIALES) pour les placer au cœur de la transformation systémique du Sénégal déclinée par le référentiel "Sénégal Vision 2050".
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-success-500/10 border border-success-500/20 rounded-xl p-6 text-center">
                <Users className="w-12 h-12 text-success-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-50 mb-2">27 650</h3>
                <p className="text-neutral-300">GIEs de femmes participants</p>
              </div>
              <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-6 text-center">
                <Building className="w-12 h-12 text-accent-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-50 mb-2">27 650</h3>
                <p className="text-neutral-300">Centrales d'achats modernes</p>
              </div>
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6 text-center">
                <Truck className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-50 mb-2">45</h3>
                <p className="text-neutral-300">Centres de distribution départementaux</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-neutral-50 mb-4">Répartition des participants</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent-400">691 250</div>
                  <div className="text-neutral-300">Femmes (minimum)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success-400">331 800</div>
                  <div className="text-neutral-300">Jeunes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-400">82 950</div>
                  <div className="text-neutral-300">Adultes ressources</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-50">2 000</div>
                  <div className="text-neutral-300">Par commune</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectifs */}
      <section className="container-max section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-12 text-center">
            Objectifs de l'Initiative Globale Nexus
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {objectives.map((objective, index) => (
              <div key={index} className="bg-neutral-50/5 backdrop-blur-sm rounded-xl p-6 border border-neutral-50/10 hover:bg-neutral-50/10 transition-all duration-300">
                <div className="w-16 h-16 bg-accent-500/20 rounded-xl flex items-center justify-center mb-6">
                  <objective.icon className="w-8 h-8 text-accent-400" />
                </div>
                <h3 className="text-xl font-bold text-neutral-50 mb-4">{objective.title}</h3>
                <p className="text-neutral-200 leading-relaxed">{objective.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Répartition des revenus */}
      <section className="container-max section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-12 text-center">
            Répartition des Revenus Nets d'Exploitation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {revenueDistribution.map((item, index) => (
              <div key={index} className="bg-neutral-50/5 backdrop-blur-sm rounded-xl p-6 border border-neutral-50/10">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-accent-400 mb-2">{item.percentage}</div>
                  <h3 className="text-xl font-bold text-neutral-50">{item.entity}</h3>
                </div>
                <p className="text-neutral-200 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-neutral-50 mb-6 text-center">Notes importantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-neutral-200">Aucune expropriation forcée - Adhésion libre des populations</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-neutral-200">Terres des plans vastes appartiennent aux GIEs de femmes</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-neutral-200">Fonciers des centres de transformation appartiennent à FEVEO 2050 SAS</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-neutral-200">Technologies et infrastructures appartiennent à Nexus Group jusqu'à amortissement</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-neutral-200">Toutes les productions font partie de la valeur économique globale</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-neutral-200">Crédibilité par le respect des engagements - Seule garantie du projet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container-max section-padding py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-accent-500/20 to-primary-500/20 backdrop-blur-sm rounded-2xl p-8 border border-accent-500/30">
            <h2 className="text-3xl font-bold text-neutral-50 mb-4">
              Rejoignez l'Initiative FEVEO 2050
            </h2>
            <p className="text-lg text-neutral-200 mb-8">
              Participez à la transformation systémique de l'économie sénégalaise par l'économie organique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                 onClick={() => onNavigate?.('investir')}
                className="btn-accent text-lg px-8 py-4"
              >
                Commencer mon investissement
              </button>
              <button
                 onClick={() => onNavigate?.('adhesions')}
                className="btn-secondary bg-neutral-50/10 border-neutral-50/20 text-neutral-50 hover:bg-neutral-50/20 text-lg px-8 py-4"
              >
                Adhérer à un GIE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
