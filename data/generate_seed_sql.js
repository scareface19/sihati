const fs = require('fs');
const path = require('path');

// Read the raw medications data
const buildDatasetPath = path.join(__dirname, 'build_dataset.js');
const buildCode = fs.readFileSync(buildDatasetPath, 'utf8');

const rawMatch = buildCode.match(/const rawData = `([\s\S]*?)`;/);
if (!rawMatch) {
  console.error("Could not find rawData");
  process.exit(1);
}

const rawData = rawMatch[1];
const lines = rawData.trim().split('\n');

function cleanSQLStr(str) {
  if (!str) return "''";
  return "'" + str.replace(/'/g, "''").replace(/\\/g, "\\\\").trim() + "'";
}

const medInserts = [];
for (let line of lines) {
  if (!line.trim()) continue;
  const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
  const row = [];
  let match;
  while ((match = regex.exec(line)) !== null && row.length < 8) {
    let val = match[1];
    if (val === undefined) break;
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1).replace(/""/g, '"');
    }
    row.push(val.trim());
    if (regex.lastIndex === line.length) break;
  }

  if (row.length >= 8) {
    const regNum = cleanSQLStr(row[1]);
    const code = cleanSQLStr(row[2]);
    const dci = cleanSQLStr(row[3]);
    const brand = cleanSQLStr(row[4]);
    const form = cleanSQLStr(row[5]);
    const dosage = cleanSQLStr(row[6]);
    const pack = cleanSQLStr(row[7]);
    medInserts.push(`(${regNum}, ${code}, ${dci}, ${brand}, ${form}, ${dosage}, ${pack})`);
  }
}

let sql = `-- ========================================================
-- Données Initiales "صحّتي" (SIHATI) - Données Réelles
-- Nomenclature Officielle 2025 (560 Médicaments) + Utilisateurs Démo
-- ========================================================

USE sihati_db;

-- Désactivation temporaire des vérifications de clés étrangères pour le peuplement
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE prescription_items;
TRUNCATE TABLE prescriptions;
TRUNCATE TABLE medical_records;
TRUNCATE TABLE appointments;
TRUNCATE TABLE emergency_contacts;
TRUNCATE TABLE emergency_alerts;
TRUNCATE TABLE access_consents;
TRUNCATE TABLE self_medications;
TRUNCATE TABLE medical_documents;
TRUNCATE TABLE medications;
TRUNCATE TABLE doctors;
TRUNCATE TABLE patients;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Utilisateurs Démo
-- Mot de passe pour tous les comptes démo: "password123" (Haché avec bcrypt $2a$10$wK1k6p...)
INSERT INTO users (id, phone, email, password_hash, role, first_name, last_name) VALUES
(1, '0555123456', 'patient@sihati.dz', '$2a$10$qR6FvY4pEvY08s3mX4G5he49gXoYgH4bO1x06QcZz6VqfJpGz5Y1e', 'PATIENT', 'محمد أمين', 'بن علي'),
(2, '0661234567', 'dr.ali@sihati.dz', '$2a$10$qR6FvY4pEvY08s3mX4G5he49gXoYgH4bO1x06QcZz6VqfJpGz5Y1e', 'DOCTOR', 'محمد', 'علي'),
(3, '0662345678', 'dr.sara@sihati.dz', '$2a$10$qR6FvY4pEvY08s3mX4G5he49gXoYgH4bO1x06QcZz6VqfJpGz5Y1e', 'DOCTOR', 'سارة', 'أحمد'),
(4, '0663456789', 'dr.yasser@sihati.dz', '$2a$10$qR6FvY4pEvY08s3mX4G5he49gXoYgH4bO1x06QcZz6VqfJpGz5Y1e', 'DOCTOR', 'ياسر', 'محمود'),
(5, '0550000000', 'admin@sihati.dz', '$2a$10$qR6FvY4pEvY08s3mX4G5he49gXoYgH4bO1x06QcZz6VqfJpGz5Y1e', 'ADMIN', 'مدير', 'النظام');

-- 2. Profils Patients
INSERT INTO patients (id, user_id, date_of_birth, gender, blood_group, height_cm, weight_kg, wilaya, commune, chronic_diseases, allergies, emergency_token) VALUES
(1, 1, '1996-05-14', 'M', 'O+', 175.0, 72.0, 'Sétif', 'Sétif Centre', 'ضغط الدم المرتفع', 'حساسية البنسلين (شديدة), حساسية المكسرات (شديدة), غبار (متوسطة)', 'sihati-sos-token-2024-784512');

-- 3. Contacts d'Urgence
INSERT INTO emergency_contacts (patient_id, name, relation, phone, priority_order) VALUES
(1, 'فاطمة بن علي', 'أم (Mère)', '0612345678', 1),
(1, 'أحمد بن علي', 'أخ (Frère)', '0698765432', 2);

-- 4. Profils Médecins (Wilaya de Sétif - Pilote)
INSERT INTO doctors (id, user_id, license_number, specialty, wilaya, commune, clinic_address, consultation_fee, latitude, longitude, bio, is_verified) VALUES
(1, 2, 'MED-SETIF-2015-089', 'طبيب عام (Médecine Générale)', 'Sétif', 'Sétif', 'حي 1014 مسكن، عمارة ب، سطيف', 1500.00, 36.1911, 5.4137, 'طبيب عام ذو خبرة 10 سنوات في الفحص السريري والمتابعة الشاملة.', 1),
(2, 3, 'MED-SETIF-2018-142', 'أخصائية قلب (Cardiologie)', 'Sétif', 'El Eulma', 'شارع أول نوفمبر، العلمة، سطيف', 2500.00, 36.1528, 5.6908, 'أخصائية في أمراض وجراحة القلب والشرايين وتخطيط القلب.', 1),
(3, 4, 'MED-SETIF-2020-205', 'أخصائي أطفال (Pédiatrie)', 'Sétif', 'Ain Oulmene', 'حي المستقبل، عين ولمان، سطيف', 2000.00, 35.9189, 5.2978, 'طبيب مختص في صحة ونمو الأطفال وحديثي الولادة واللقاحات.', 1);

-- 5. Automédication déclarée par le Patient (العلاج الذاتي)
INSERT INTO self_medications (patient_id, product_name, product_type, reason, dosage, frequency, started_at, notes) VALUES
(1, 'فيتامين د (Vitamine D)', 'SUPPLEMENT', 'نقص المناعة والإرهاق', '1000 وحدة', 'مرة في اليوم صباحاً', '2024-01-10', 'مكمل غذائي بعد الغداء'),
(1, 'بابونج وزنجبيل (Tisane Camomille)', 'HERBAL', 'الاسترخاء وتحسين الهضم', 'كوب دافئ', 'مساء قبل النوم', '2024-03-01', 'أعشاب طبيعية');

-- 6. Dossier Médical & Consultation
INSERT INTO medical_records (id, patient_id, doctor_id, specialty, diagnosis, clinical_notes, treatment_plan) VALUES
(1, 1, 1, 'طبيب عام (Médecine Générale)', 'ارتفاع ضغط الدم الشرياني الخفيف (HTA modérée)', 'المريض يعاني من ضغط دم مرتفع تحت السيطرة. تجنب مشتقات البنسلين لوجود حساسية مؤكدة.', 'حمية قليلة الملح، ممارسة المشي 30 دقيقة يومياً، وتناول العلاج بانتظام.');

-- 7. Ordonnance & Lignes d''Ordonnance
INSERT INTO prescriptions (id, record_id, patient_id, doctor_id, qr_code_hash, status) VALUES
(1, 1, 1, 1, 'ORD-2024-SETIF-984712', 'ACTIVE');

-- 8. Rendez-vous Démo
INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason, notes) VALUES
(1, 1, DATE_ADD(NOW(), INTERVAL 2 DAY), 'CONFIRMED', 'متابعة ضغط الدم والتحاليل', 'يرجى إحضار نتائج تحليل الدم الجديد'),
(1, 2, DATE_ADD(NOW(), INTERVAL 7 DAY), 'PENDING', 'فحص دوري لتخطيط القلب (ECG)', 'فحص روتيني سنوي');

-- 9. Insertion des 560 Médicaments de la Nomenclature Nationale 2025
INSERT INTO medications (registration_number, code, dci, brand_name, form, dosage, packaging) VALUES
${medInserts.join(',\n')};
`;

const outputPath = path.join(__dirname, 'seed_data.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Successfully generated ${outputPath} with ${medInserts.length} medications and demo accounts!`);
