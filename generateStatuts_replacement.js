// Nouveau code pour la fonction generateStatuts
// À remplacer dans GIEDocumentWorkflow.tsx à la ligne 225

const generateStatuts = () => {
  // Convertir les codes en noms
  const getNomRegion = () => {
    const region = regions.find(r => r.code === gieData.region);
    return region ? region.nom : gieData.region;
  };

  const getNomDepartement = () => {
    if (!gieData.region || !gieData.departement) return gieData.departement;
    const departements = getDepartements(gieData.region);
    const dept = departements.find(d => d.code === gieData.departement);
    return dept ? dept.nom : gieData.departement;
  };

  const getNomArrondissement = () => {
    if (!gieData.region || !gieData.departement || !gieData.arrondissement) return gieData.arrondissement;
    const arrondissements = getArrondissements(gieData.region, gieData.departement);
    const arr = arrondissements.find(a => a.code === gieData.arrondissement);
    return arr ? arr.nom : gieData.arrondissement;
  };

  const getNomCommune = () => {
    if (!gieData.region || !gieData.departement || !gieData.arrondissement || !gieData.commune) return gieData.commune;
    const communes = getCommunes(gieData.region, gieData.departement, gieData.arrondissement);
    const commune = communes.find(c => c.code === gieData.commune);
    return commune ? commune.nom : gieData.commune;
  };

  return `STATUTS DU GIE FEVEO ………………………

Aujourd'hui,
__/___/2025

Dans la région de : ${getNomRegion()}
département de : ${getNomDepartement()}
arrondissement de : ${getNomArrondissement()}
commune de : ${getNomCommune()}

Les soussignés,`;
};
