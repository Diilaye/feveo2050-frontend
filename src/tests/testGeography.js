// Test des fonctions géographiques du Sénégal
import { 
  SENEGAL_GEOGRAPHIC_DATA, 
  getRegions, 
  getDepartements, 
  getArrondissements, 
  getCommunes,
  validateGeographicLocation
} from '../data/senegalGeography.ts';

console.log('🧪 Test des données géographiques du Sénégal');
console.log('=' .repeat(50));

// Test 1: Obtenir toutes les régions
console.log('\n1️⃣ Test des régions:');
const regions = getRegions();
console.log(`✅ Nombre de régions: ${regions.length}`);
regions.forEach(region => {
  console.log(`   ${region.code} - ${region.nom}`);
});

// Test 2: Obtenir les départements de Dakar
console.log('\n2️⃣ Test des départements de Dakar:');
const departementsDAKAR = getDepartements('DAKAR');
console.log(`✅ Nombre de départements à Dakar: ${departementsDAKAR.length}`);
departementsDAKAR.forEach(dept => {
  console.log(`   ${dept.code} - ${dept.nom}`);
});

// Test 3: Obtenir les arrondissements de Dakar/Dakar
console.log('\n3️⃣ Test des arrondissements de Dakar/Dakar:');
const arrondissementsDAKAR = getArrondissements('DAKAR', 'DAKAR');
console.log(`✅ Nombre d'arrondissements: ${arrondissementsDAKAR.length}`);
arrondissementsDAKAR.forEach(arr => {
  console.log(`   ${arr.code} - ${arr.nom}`);
});

// Test 4: Obtenir les communes de Dakar/Dakar/Almadies
console.log('\n4️⃣ Test des communes de Dakar/Dakar/Almadies:');
const communesALMADIES = getCommunes('DAKAR', 'DAKAR', 'ALMADIES');
console.log(`✅ Nombre de communes aux Almadies: ${communesALMADIES.length}`);
communesALMADIES.forEach(commune => {
  console.log(`   ${commune.nom}`);
});

// Test 5: Validation d'une localisation
console.log('\n5️⃣ Test de validation géographique:');
const validation1 = validateGeographicLocation('DAKAR', 'DAKAR', 'ALMADIES', 'Ngor');
const validation2 = validateGeographicLocation('DAKAR', 'DAKAR', 'ALMADIES', 'Ville inexistante');

console.log(`✅ Dakar/Dakar/Almadies/Ngor: ${validation1 ? 'VALIDE' : 'INVALIDE'}`);
console.log(`❌ Dakar/Dakar/Almadies/Ville inexistante: ${validation2 ? 'VALIDE' : 'INVALIDE'}`);

// Test 6: Test d'une autre région (Thiès)
console.log('\n6️⃣ Test d\'une autre région (Thiès):');
const departementsThies = getDepartements('THIES');
console.log(`✅ Départements de Thiès: ${departementsThies.length}`);
departementsThies.forEach(dept => {
  console.log(`   ${dept.code} - ${dept.nom}`);
});

const arrondissementsMbour = getArrondissements('THIES', 'MBOUR');
console.log(`✅ Arrondissements de Mbour: ${arrondissementsMbour.length}`);
arrondissementsMbour.forEach(arr => {
  console.log(`   ${arr.code} - ${arr.nom}`);
});

// Test 7: Statistiques générales
console.log('\n7️⃣ Statistiques générales:');
let totalDepartements = 0;
let totalArrondissements = 0;
let totalCommunes = 0;

Object.keys(SENEGAL_GEOGRAPHIC_DATA).forEach(regionCode => {
  const region = SENEGAL_GEOGRAPHIC_DATA[regionCode];
  const depts = Object.keys(region.departements);
  totalDepartements += depts.length;
  
  depts.forEach(deptCode => {
    const dept = region.departements[deptCode];
    const arrs = Object.keys(dept.arrondissements);
    totalArrondissements += arrs.length;
    
    arrs.forEach(arrCode => {
      const arr = dept.arrondissements[arrCode];
      totalCommunes += arr.communes.length;
    });
  });
});

console.log(`📊 Total régions: ${regions.length}`);
console.log(`📊 Total départements: ${totalDepartements}`);
console.log(`📊 Total arrondissements: ${totalArrondissements}`);
console.log(`📊 Total communes: ${totalCommunes}`);

console.log('\n🎉 Tous les tests sont terminés !');
console.log('Les données géographiques du Sénégal sont prêtes pour l\'utilisation.');
