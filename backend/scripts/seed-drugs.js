const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sihati_db'
  });

  const lyricaTimeline = JSON.stringify([
    {
      step: 'تصنيع ومراقبة تحليلية للمادة الأولية (Loi 04-18)',
      location: 'مجمع صيدال - وحدة الإنتاج قسنطينة',
      date: '01/02/2026',
      actor: 'مخبر مراقبة الجودة والسلائف الكيميائية',
      status: 'CONFORME',
      temperatureObserved: 21.0
    },
    {
      step: 'إشعار الحصة للمفتشية الصيدلانية بوزارة الصناعة الصيدلانية',
      location: 'وزارة الإنتاج الصيدلاني (MIP Alger)',
      date: '10/02/2026',
      actor: 'اللجنة الوطنية لمراقبة المؤثرات العقلية',
      status: 'CONFORME',
      temperatureObserved: 20.5
    },
    {
      step: 'نقل مصفح ومراقب بنظام التتبع اللوجستي GPS',
      location: 'مسار قسنطينة - سطيف (PharmaTrans DZ)',
      date: '18/02/2026',
      actor: 'ناقل أدوية معتمد ومرخص للمواد الحساسة',
      status: 'CONFORME',
      temperatureObserved: 19.8
    },
    {
      step: 'استلام بالصيدلية وقيد بالسجل الخاص للمؤثرات العقلية',
      location: 'صيدلية بلمعزة - سطيف المركز (خزانة مقفلة)',
      date: '25/02/2026',
      actor: 'د. يوسف بلمعزة (صيدلي معتمد)',
      status: 'CONFORME',
      temperatureObserved: 21.2
    },
    {
      step: 'صرف بوصفة طبية مؤمنة ثلاثية النسخ وبطاقة الشفاء',
      location: 'شباك الصرف - المريض محمد أمين بن علي',
      date: '20/03/2026',
      actor: 'تسجيل رسمي برقم بطاقة الشفاء وبطاقة التعريف',
      status: 'DISPENSED',
      temperatureObserved: 20.8
    }
  ]);

  const tramadolTimeline = JSON.stringify([
    {
      step: 'تصنيع صيدلاني مقنن (جدول ب - مسكن أفيوني مركزي)',
      location: 'وحدة صيدال المدية (SAIDAL)',
      date: '01/03/2026',
      actor: 'قسم مراقبة الأدوية المقننة',
      status: 'CONFORME',
      temperatureObserved: 20.0
    },
    {
      step: 'تتبع تسلسلي ومطابقة الباركود الموحد Datamatrix',
      location: 'المركز اللوجستي المغاربي للأدوية سطيف',
      date: '12/03/2026',
      actor: 'مؤسسة التوزيع الصيدلاني المعتمدة',
      status: 'CONFORME',
      temperatureObserved: 20.2
    },
    {
      step: 'حفظ آمن في خزانة المواد المقيدة بالصيدلية',
      location: 'صيدلية بلمعزة (سطيف)',
      date: '15/03/2026',
      actor: 'د. يوسف بلمعزة',
      status: 'CONFORME',
      temperatureObserved: 20.1
    }
  ]);

  await conn.query(`
    INSERT INTO drug_traceability (
      cip_code, brand_name, dci, dosage, form, batch_number, serial_number,
      manufacturer, manufacturing_country, manufacturing_date, expiry_date,
      cold_chain_required, temperature_min, temperature_max, current_temperature,
      current_stage, current_location, status, verification_hash, timeline, created_at, updated_at
    ) VALUES 
    (
      'MIP-2025-055', 'LYRICA 150 MG', 'PREGABALINE (مؤثر عقلي مراقب - قانون 04-18 / مرسوم 21-196)', '150 MG', 'GELULE',
      'LOT-2026-PSY-9011', 'SN-ALG-2026-PSY-88912', 'SAIDAL (Usine Constantine) sous licence', 'Algérie (إنتاج وطني مراقب)',
      '2026-02-01', '2029-02-01', 0, 15.0, 25.0, 21.2, 'PHARMACY', 'خزانة المواد المقننة والمؤثرات العقلية - صيدلية بلمعزة (سطيف)',
      'CONFORME', 'a8f5b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5', ?, NOW(), NOW()
    ),
    (
      'MIP-2025-089', 'TRAMADOL SAIDAL 50 MG', 'TRAMADOL CHLORHYDRATE (مسكن أفيوني مركزي - جدول ب)', '50 MG', 'COMPRIME',
      'LOT-2026-STUP-4401', 'SN-ALG-2026-STUP-11029', 'SAIDAL Médéa', 'Algérie (إنتاج وطني)',
      '2026-03-01', '2029-03-01', 0, 15.0, 25.0, 20.1, 'PHARMACY', 'صيدلية بلمعزة - سجل المواد السمية والمؤثرات العقلية',
      'CONFORME', 'c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8', ?, NOW(), NOW()
    )
    ON DUPLICATE KEY UPDATE
      brand_name=VALUES(brand_name),
      dci=VALUES(dci),
      current_location=VALUES(current_location),
      timeline=VALUES(timeline),
      updated_at=NOW()
  `, [lyricaTimeline, tramadolTimeline]);

  console.log('Seeded Lyrica & Tramadol successfully!');
  await conn.end();
}

run().catch(console.error);
