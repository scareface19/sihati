const path = require('path');
const mysql = require(path.join(__dirname, '../backend/node_modules/mysql2/promise'));

const LAB_ANALYSES = [
  'FNS', 'VS', 'CRP', 'Glycémie', 'HbA1c', 'Urée', 'Créatinine', 'Acide urique', 'Ionogramme',
  'ASAT (AST)', 'ALAT (ALT)', 'GGT', 'PAL', 'Bilirubine totale', 'Cholestérol total', 'HDL', 'LDL',
  'Triglycérides', 'Ferritine', 'Fer sérique', 'Vitamine D', 'Vitamine B12', 'TSH', 'FT3', 'FT4',
  'Prolactine', 'FSH', 'LH', 'β-hCG', 'Cortisol', 'TP', 'INR', 'TCA', 'Fibrinogène', 'D-Dimères',
  'ECBU', 'Coproculture', 'Hémoculture', 'EPS', 'Groupe ABO', 'Rhésus', 'VIH', 'HBsAg', 'Anti-HCV',
  'VDRL', 'TPHA', 'PSA', 'CEA', 'CA 125', 'CA 19-9', 'AFP', 'Troponine', 'CK', 'CK-MB', 'LDH',
  'Amylase', 'Lipase'
];

const RADIOLOGY_EXAMS = [
  'Radiographie du thorax', 'Radiographie du crâne', 'Radiographie de la colonne cervicale',
  'Radiographie de la colonne lombaire', 'Radiographie du bassin', 'Radiographie de l\'épaule',
  'Radiographie du bras', 'Radiographie du coude', 'Radiographie du poignet', 'Radiographie de la main',
  'Radiographie de la hanche', 'Radiographie du genou', 'Radiographie de la jambe',
  'Radiographie de la cheville', 'Radiographie du pied', 'Échographie abdominale',
  'Échographie pelvienne', 'Échographie rénale', 'Échographie thyroïdienne', 'Échographie mammaire',
  'Échographie obstétricale', 'Échographie Doppler', 'Scanner cérébral', 'Scanner thoracique',
  'Scanner abdominal', 'Scanner pelvien', 'IRM cérébrale', 'IRM rachidienne', 'IRM du genou',
  'IRM de l\'épaule', 'Mammographie', 'Ostéodensitométrie (DEXA)', 'ECG (Électrocardiogramme)',
  'Holter ECG', 'Holter tensionnel', 'Échocardiographie', 'EEG (Électroencéphalogramme)',
  'EMG (Électromyogramme)', 'Fibroscopie digestive', 'Coloscopie'
];

async function seedLabAndRad() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sihati_db',
    multipleStatements: true,
  });

  console.log('Connected to MySQL sihati_db...');

  // 1. Create table lab_analysis_catalog
  await connection.query(`
    CREATE TABLE IF NOT EXISTS lab_analysis_catalog (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL UNIQUE,
      category VARCHAR(100) NOT NULL DEFAULT 'Biologie Médicale',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  // 2. Create table radiology_exam_catalog
  await connection.query(`
    CREATE TABLE IF NOT EXISTS radiology_exam_catalog (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL UNIQUE,
      modality VARCHAR(100) NOT NULL DEFAULT 'Imagerie Médicale',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  console.log('Tables lab_analysis_catalog & radiology_exam_catalog created.');

  // Insert Lab Analyses
  for (const name of LAB_ANALYSES) {
    let cat = 'Biochimie';
    if (['FNS', 'VS', 'TP', 'INR', 'TCA', 'Fibrinogène', 'D-Dimères'].includes(name)) cat = 'Hématologie';
    else if (['TSH', 'FT3', 'FT4', 'Prolactine', 'FSH', 'LH', 'β-hCG', 'Cortisol'].includes(name)) cat = 'Hormonologie';
    else if (['ECBU', 'Coproculture', 'Hémoculture', 'EPS'].includes(name)) cat = 'Microbiologie';
    else if (['Groupe ABO', 'Rhésus', 'VIH', 'HBsAg', 'Anti-HCV', 'VDRL', 'TPHA'].includes(name)) cat = 'Immunologie & Sérologie';
    else if (['PSA', 'CEA', 'CA 125', 'CA 19-9', 'AFP'].includes(name)) cat = 'Marqueurs Tumoraux';
    else if (['Troponine', 'CK', 'CK-MB', 'LDH'].includes(name)) cat = 'Enzymologie Cardiaque';

    await connection.query(
      'INSERT IGNORE INTO lab_analysis_catalog (name, category) VALUES (?, ?)',
      [name, cat]
    );
  }
  console.log(`Inserted ${LAB_ANALYSES.length} official biological analyses.`);

  // Insert Radiology Exams
  for (const name of RADIOLOGY_EXAMS) {
    let modality = 'Radiographie';
    if (name.includes('Échographie') || name.includes('Échocardiographie')) modality = 'Échographie / Doppler';
    else if (name.includes('Scanner')) modality = 'Scanner TDM';
    else if (name.includes('IRM')) modality = 'IRM';
    else if (name.includes('ECG') || name.includes('Holter') || name.includes('EEG') || name.includes('EMG')) modality = 'Exploration Fonctionnelle';
    else if (name.includes('scopie')) modality = 'Endoscopie';

    await connection.query(
      'INSERT IGNORE INTO radiology_exam_catalog (name, modality) VALUES (?, ?)',
      [name, modality]
    );
  }
  console.log(`Inserted ${RADIOLOGY_EXAMS.length} official imaging & functional examinations.`);

  const [labCount] = await connection.query('SELECT COUNT(*) as count FROM lab_analysis_catalog');
  const [radCount] = await connection.query('SELECT COUNT(*) as count FROM radiology_exam_catalog');
  const [medCount] = await connection.query('SELECT COUNT(*) as count FROM medications');

  console.log(`\n================ DATABASE STATUS ================`);
  console.log(`Total Algerian Medications 2025 in MySQL: ${medCount[0].count}`);
  console.log(`Total Biological Analyses in MySQL: ${labCount[0].count}`);
  console.log(`Total Medical Imaging Exams in MySQL: ${radCount[0].count}`);
  console.log(`=================================================`);

  await connection.end();
}

seedLabAndRad().catch(console.error);
