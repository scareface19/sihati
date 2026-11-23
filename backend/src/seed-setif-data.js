const mysql = require('mysql2/promise');
require('dotenv').config();

const examinations = [
  { id: 1, name: "Radiographie du thorax", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 2, name: "Radiographie du crâne", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Retrait des objets métalliques" },
  { id: 3, name: "Radiographie de la colonne cervicale", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 4, name: "Radiographie de la colonne lombaire", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 5, name: "Radiographie du bassin", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 6, name: "Radiographie de l'épaule", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 7, name: "Radiographie du bras", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 8, name: "Radiographie du coude", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 9, name: "Radiographie du poignet", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 10, name: "Radiographie de la main", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 11, name: "Radiographie de la hanche", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 12, name: "Radiographie du genou", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 13, name: "Radiographie de la jambe", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 14, name: "Radiographie de la cheville", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 15, name: "Radiographie du pied", category: "Radiologie Conventionnelle", modality: "XRAY", preparation: "Aucune" },
  { id: 16, name: "Échographie abdominale", category: "Échographie", modality: "ULTRASOUND", preparation: "À jeun depuis 6 heures" },
  { id: 17, name: "Échographie pelvienne", category: "Échographie", modality: "ULTRASOUND", preparation: "Vessie pleine (boire 1L d'eau)" },
  { id: 18, name: "Échographie rénale", category: "Échographie", modality: "ULTRASOUND", preparation: "Boire 500ml d'eau avant examen" },
  { id: 19, name: "Échographie thyroïdienne", category: "Échographie", modality: "ULTRASOUND", preparation: "Aucune" },
  { id: 20, name: "Échographie mammaire", category: "Échographie", modality: "ULTRASOUND", preparation: "Apporter anciens clichés" },
  { id: 21, name: "Échographie obstétricale", category: "Échographie", modality: "ULTRASOUND", preparation: "Vessie modérément pleine selon terme" },
  { id: 22, name: "Échographie Doppler", category: "Échographie Vasculaire", modality: "ULTRASOUND", preparation: "Aucune" },
  { id: 23, name: "Scanner cérébral", category: "Tomodensitométrie (Scanner)", modality: "CT", preparation: "À jeun 4h si injection produit de contraste" },
  { id: 24, name: "Scanner thoracique", category: "Tomodensitométrie (Scanner)", modality: "CT", preparation: "Contrôle créatininémie si injection" },
  { id: 25, name: "Scanner abdominal", category: "Tomodensitométrie (Scanner)", modality: "CT", preparation: "À jeun 6h + préparation digestive" },
  { id: 26, name: "Scanner pelvien", category: "Tomodensitométrie (Scanner)", modality: "CT", preparation: "À jeun 4h" },
  { id: 27, name: "IRM cérébrale", category: "Imagerie par Résonance Magnétique", modality: "MRI", preparation: "Contre-indication : stimulateur cardiaque / métal" },
  { id: 28, name: "IRM rachidienne", category: "Imagerie par Résonance Magnétique", modality: "MRI", preparation: "Vérifier absence de corps étrangers métalliques" },
  { id: 29, name: "IRM du genou", category: "Imagerie par Résonance Magnétique", modality: "MRI", preparation: "Aucune" },
  { id: 30, name: "IRM de l'épaule", category: "Imagerie par Résonance Magnétique", modality: "MRI", preparation: "Aucune" },
  { id: 31, name: "Mammographie", category: "Sénologie", modality: "MAMMO", preparation: "Ne pas appliquer de déodorant ou talc" },
  { id: 32, name: "Ostéodensitométrie (DEXA)", category: "Rhumatologie / Imagerie", modality: "DEXA", preparation: "Aucune" },
  { id: 33, name: "ECG (Électrocardiogramme)", category: "Exploration Cardiologique", modality: "ECG", preparation: "Au repos pendant 10 minutes" },
  { id: 34, name: "Holter ECG", category: "Exploration Cardiologique", modality: "HOLTER", preparation: "Port de l'appareil 24h à 48h en activité normale" },
  { id: 35, name: "Holter tensionnel", category: "Exploration Cardiologique", modality: "MAPA", preparation: "Port du brassard automatique 24h" },
  { id: 36, name: "Échocardiographie", category: "Exploration Cardiologique", modality: "ECHO_CARDIO", preparation: "Aucune" },
  { id: 37, name: "EEG (Électroencéphalogramme)", category: "Exploration Neurologique", modality: "EEG", preparation: "Cheveux propres sans gel ni huile" },
  { id: 38, name: "EMG (Électromyogramme)", category: "Exploration Neurologique", modality: "EMG", preparation: "Ne pas appliquer de crème hydratante" },
  { id: 39, name: "Fibroscopie digestive", category: "Endoscopie Médicale", modality: "ENDOSCOPY", preparation: "Strictement à jeun depuis 6h" },
  { id: 40, name: "Coloscopie", category: "Endoscopie Médicale", modality: "ENDOSCOPY", preparation: "Régime sans résidu 3j + préparation colique" }
];

const sampleDoctorsSetif = [
  // Cardiologie
  { name: "Dr Bouattoura H.N", specialty: "أمراض القلب (Cardiologie)", phone: "036668988", commune: "Sétif Centre", fee: 2000, isVerified: true },
  { name: "Dr Belkhodja", specialty: "أمراض القلب (Cardiologie)", phone: "036846262", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "Dr. Benzighiba", specialty: "أمراض القلب (Cardiologie)", phone: "0667090039", commune: "El Eulma", fee: 2200, isVerified: true },
  { name: "الدكتور محدادي", specialty: "أمراض القلب (Cardiologie)", phone: "0559404875", commune: "Ain Oulmene", fee: 1800, isVerified: false },
  { name: "Dr CHAKER Mohamed Lamine", specialty: "أمراض القلب (Cardiologie)", phone: "0659790200", commune: "Sétif", fee: 2500, isVerified: true },
  { name: "Dr BOUKHARI Ramzi", specialty: "أمراض القلب (Cardiologie)", phone: "0658687558", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "د. بن عطية أمينة (طب قلب أطفال)", specialty: "طب قلب أطفال (Cardio Pédiatrie)", phone: "0558270972", commune: "Sétif Centre", fee: 2500, isVerified: true },

  // Gynécologie
  { name: "الدكتور خلفاوي يوسف", specialty: "أمراض النساء والتوليد (Gynécologie)", phone: "0559324731", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "Dr H Benallegue", specialty: "أمراض النساء والتوليد (Gynécologie)", phone: "036838327", commune: "Sétif", fee: 2200, isVerified: true },
  { name: "Dr Latri Cherifa", specialty: "أمراض النساء والتوليد (Gynécologie)", phone: "0563284650", commune: "El Eulma", fee: 2000, isVerified: true },
  { name: "Dr Chorfi Yacine", specialty: "أمراض النساء والتوليد (Gynécologie)", phone: "030775685", commune: "Ain Oulmene", fee: 2000, isVerified: false },
  { name: "الدكتورة بليليطة وهيبة", specialty: "أمراض النساء والتوليد (Gynécologie)", phone: "0664205122", commune: "Sétif", fee: 2200, isVerified: true },

  // Pédiatrie
  { name: "Dr Mezaghcha Ali", specialty: "طب الأطفال (Pédiatrie)", phone: "0697979780", commune: "Sétif", fee: 1800, isVerified: true },
  { name: "Dr Griche Amina", specialty: "طب الأطفال (Pédiatrie)", phone: "0670872546", commune: "El Eulma", fee: 1800, isVerified: true },
  { name: "الدكتور سامي بوقصة", specialty: "طب الأطفال (Pédiatrie)", phone: "0697979781", commune: "Sétif Centre", fee: 2000, isVerified: true },
  { name: "Dr Touati Khadra", specialty: "طب الأطفال (Pédiatrie)", phone: "036451010", commune: "Ain Arnat", fee: 1600, isVerified: false },
  { name: "Dr. Metarf (جراح أطفال)", specialty: "جراحة أطفال (Chirurgie Pédiatrique)", phone: "0541674271", commune: "Sétif", fee: 2500, isVerified: true },

  // Dermatologie
  { name: "Dr. MERIANE Mohamed", specialty: "أمراض الجلد (Dermatologie)", phone: "036826567", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "Dr TOUNSI Toufik", specialty: "أمراض الجلد (Dermatologie)", phone: "0554730032", commune: "El Eulma", fee: 2000, isVerified: true },
  { name: "الدكتورة عالم ابتسام", specialty: "أمراض الجلد (Dermatologie)", phone: "0676935729", commune: "Ain Oulmene", fee: 1800, isVerified: false },

  // ORL
  { name: "Dr Khaloua", specialty: "أنف وأذن وحنجرة (ORL)", phone: "0699697143", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "الدكتور بن زميت", specialty: "أنف وأذن وحنجرة (ORL)", phone: "036610271", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "Dr. CHOUANE", specialty: "أنف وأذن وحنجرة (ORL)", phone: "0658601445", commune: "Ain Arnat", fee: 1800, isVerified: true },
  { name: "الدكتور بوشول عاشور", specialty: "أنف وأذن وحنجرة (ORL)", phone: "036581135", commune: "Ain Oulmene", fee: 1800, isVerified: true },

  // Ophtalmologie
  { name: "Dr KIRAT", specialty: "طب العيون (Ophtalmologie)", phone: "0559697956", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "Dr Gasmi", specialty: "طب العيون (Ophtalmologie)", phone: "0564240746", commune: "Sétif Centre", fee: 2000, isVerified: true },
  { name: "Dr BENMAHAMMED (جراح عيون)", specialty: "جراحة العيون (Chirurgie Ophtalmo)", phone: "0666278846", commune: "El Eulma", fee: 2500, isVerified: true },

  // Pneumologie
  { name: "Dr Khoufache Lamia", specialty: "أمراض صدرية (Pneumologie)", phone: "0556263055", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "الدكتور عريبي علاوة", specialty: "أمراض صدرية (Pneumologie)", phone: "036743800", commune: "Sétif", fee: 2200, isVerified: true },
  { name: "الدكتور حفاصة عبد الحق", specialty: "أمراض صدرية (Pneumologie)", phone: "0771825265", commune: "Ain Oulmene", fee: 1800, isVerified: false },

  // Urologie
  { name: "الدكتور شتواني سفيان", specialty: "أمراض المسالك البولية (Urologie)", phone: "0557146679", commune: "Sétif", fee: 2200, isVerified: true },
  { name: "Dr Larafi Abdelhalim (جراح)", specialty: "جراحة المسالك البولية (Urologie)", phone: "0556218489", commune: "Sétif", fee: 2500, isVerified: true },

  // Neurologie
  { name: "Dr Khennouf H Nabti", specialty: "أمراض الأعصاب (Neurologie)", phone: "036668888", commune: "Sétif", fee: 2500, isVerified: true },
  { name: "Dr Abaoub N", specialty: "أمراض الأعصاب (Neurologie)", phone: "0557961379", commune: "Ain Oulmene", fee: 2000, isVerified: true },

  // Médecine Interne
  { name: "dr Lameche Abdelouahab", specialty: "الطب الباطني (Médecine Interne)", phone: "0552377061", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "Dr Mohamed Najib Benaouda", specialty: "الطب الباطني (Médecine Interne)", phone: "0556800666", commune: "Sétif", fee: 2200, isVerified: true },

  // Gastro-entérologie
  { name: "Dr Abdellatif khaled", specialty: "أمراض الجهاز الهضمي (Gastro-entérologie)", phone: "0553920177", commune: "Sétif", fee: 2000, isVerified: true },
  { name: "Dr chellal mohcene", specialty: "أمراض الجهاز الهضمي (Gastro-entérologie)", phone: "0699592726", commune: "El Eulma", fee: 2000, isVerified: false },

  // Orthopédie
  { name: "Dr FELLAH", specialty: "العظام والمفاصل (Orthopédie)", phone: "036660660", commune: "Sétif", fee: 2200, isVerified: true },
  { name: "Dr NEKKA", specialty: "العظام والمفاصل (Orthopédie)", phone: "030760009", commune: "Sétif", fee: 2000, isVerified: true },

  // Médecine Générale
  { name: "Dr Bentouhami Nadia", specialty: "الطب العام (Médecine Générale)", phone: "039426980", commune: "Sétif", fee: 1500, isVerified: true },
  { name: "Dr bouzouika", specialty: "الطب العام (Médecine Générale)", phone: "0659787375", commune: "Ain Arnat", fee: 1400, isVerified: true },
  { name: "Dr.Ketfi Samia", specialty: "الطب العام (Médecine Générale)", phone: "036432533", commune: "Ain Arnat", fee: 1400, isVerified: false },
  { name: "الدكتور قماش عبد الكريم", specialty: "الطب العام (Médecine Générale)", phone: "0560197906", commune: "Sétif Centre", fee: 1500, isVerified: true }
];

async function seed() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT, 10) || 3306;
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'sihati_db';

  const connection = await mysql.createConnection({ host, port, user, password, database: dbName });
  console.log('Connecté à la base sihati_db.');

  // 1. Table des examens médicaux
  console.log('Création de la table medical_examinations si inexistante...');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`medical_examinations\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`category\` VARCHAR(100) NOT NULL,
      \`modality\` VARCHAR(50) NOT NULL,
      \`preparation\` VARCHAR(255) DEFAULT 'Aucune',
      \`is_active\` BOOLEAN DEFAULT TRUE,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const [examRows] = await connection.query('SELECT count(*) as count FROM medical_examinations');
  if (examRows[0].count === 0) {
    console.log(`Insertion des ${examinations.length} examens officiels...`);
    for (const ex of examinations) {
      await connection.query(
        'INSERT INTO medical_examinations (id, name, category, modality, preparation) VALUES (?, ?, ?, ?, ?)',
        [ex.id, ex.name, ex.category, ex.modality, ex.preparation]
      );
    }
    console.log('Examens officiels insérés avec succès.');
  } else {
    console.log(`Table medical_examinations contient déjà ${examRows[0].count} examens.`);
  }

  // 2. Insertion des praticiens de Sétif
  console.log('Vérification et insertion des praticiens de la Wilaya de Sétif...');
  const passwordHash = '$2a$10$wKqC9qGvG6b3R5VfP2s8u.9yJbVjD7nE4W8kK5r6uQ9vX4z0r3K2y'; // password123

  for (let i = 0; i < sampleDoctorsSetif.length; i++) {
    const doc = sampleDoctorsSetif[i];
    const [existing] = await connection.query('SELECT id FROM users WHERE phone = ?', [doc.phone]);

    let userId;
    if (existing.length === 0) {
      const parts = doc.name.split(' ');
      const firstName = parts[0] || 'Dr';
      const lastName = parts.slice(1).join(' ') || doc.name;
      const email = `doc_${doc.phone}@sihati.dz`;

      const [userRes] = await connection.query(
        'INSERT INTO users (phone, email, password_hash, role, first_name, last_name, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [doc.phone, email, passwordHash, 'DOCTOR', firstName, lastName, true]
      );
      userId = userRes.insertId;
    } else {
      userId = existing[0].id;
    }

    const [existingDoc] = await connection.query('SELECT id FROM doctors WHERE user_id = ?', [userId]);
    if (existingDoc.length === 0) {
      const license = `ORD-SETIF-${2020 + (i % 6)}-${100 + i}`;
      await connection.query(
        'INSERT INTO doctors (user_id, license_number, specialty, wilaya, commune, clinic_address, consultation_fee, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, license, doc.specialty, 'Sétif', doc.commune, `Cabinet Médical, ${doc.commune}, Sétif`, doc.fee, doc.isVerified]
      );
    }
  }

  const [finalDocCount] = await connection.query('SELECT count(*) as count FROM doctors');
  console.log(`Total médecins actifs dans sihati_db: ${finalDocCount[0].count}`);

  await connection.end();
  console.log('Seed Sétif terminé avec succès !');
}

seed().catch(console.error);
