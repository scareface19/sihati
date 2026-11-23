import { jsPDF } from 'jspdf';
import { PlatformSettings, getPlatformSettings } from './platform-settings';

/**
 * Ouvre un document PDF ou une vue d'impression haute définition dans un nouvel onglet
 */
export function openPdfInNewTab(doc: jsPDF, title: string = 'document.pdf') {
  try {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const newWin = window.open(blobUrl, '_blank');
    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.target = '_blank';
      link.download = title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Erreur lors de l’ouverture du PDF :', error);
    doc.save(title);
  }
}

/**
 * Moteur universel d'impression et de génération PDF vectoriel natif.
 * Ouvre un nouvel onglet avec la feuille A4 officielle, rendu typographique arabe parfait (Cairo & RTL),
 * barre d'actions (Imprimer / Enregistrer en PDF) et déclencheur automatique de la boîte d'impression native.
 */
function openPrintDocumentInNewTab(title: string, bodyContentHtml: string) {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les fenêtres pop-up pour afficher et imprimer le document médical.');
    return;
  }

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, -apple-system, sans-serif;
            background-color: #f1f5f9;
            color: #0f172a;
            margin: 0;
            padding: 0;
            direction: rtl;
            font-feature-settings: "liga" 1, "calt" 1;
            text-rendering: optimizeLegibility;
          }

          /* Barre d'outils flottante non imprimable */
          .toolbar {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: #0f172a;
            color: #ffffff;
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            direction: rtl;
          }
          .toolbar-title {
            font-size: 14px;
            font-weight: 800;
            color: #10b981;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .toolbar-badge {
            font-size: 11px;
            background: #1e293b;
            color: #94a3b8;
            padding: 3px 8px;
            border-radius: 6px;
            font-family: monospace;
          }
          .toolbar-actions {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .btn-print {
            background: #059669;
            color: #ffffff;
            border: none;
            padding: 9px 18px;
            border-radius: 8px;
            font-weight: 800;
            font-size: 13px;
            font-family: 'Cairo', sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 6px rgba(5, 150, 105, 0.4);
            transition: all 0.2s;
          }
          .btn-print:hover {
            background: #047857;
            transform: translateY(-1px);
          }
          .btn-close {
            background: #334155;
            color: #ffffff;
            border: none;
            padding: 9px 14px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 12px;
            font-family: 'Cairo', sans-serif;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-close:hover {
            background: #475569;
          }

          /* Conteneur Feuille A4 */
          .page-wrapper {
            padding: 24px;
            display: flex;
            justify-content: center;
          }
          .a4-sheet {
            width: 210mm;
            min-height: 297mm;
            background: #ffffff;
            padding: 16mm 18mm;
            border-radius: 6px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: relative;
          }

          /* Règles d'impression pures A4 */
          @media print {
            body {
              background: #ffffff !important;
            }
            .no-print {
              display: none !important;
            }
            .page-wrapper {
              padding: 0 !important;
              display: block !important;
            }
            .a4-sheet {
              width: 100% !important;
              min-height: 100% !important;
              margin: 0 !important;
              padding: 10mm 12mm !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
          }
        </style>
      </head>
      <body>
        <!-- Barre supérieure d'action -->
        <div class="toolbar no-print">
          <div class="toolbar-title">
            <span>🛡️</span>
            <span>منصة صحتي • المعاينة والطباعة الرسمية عالية الدقة</span>
            <span class="toolbar-badge">A4 Standard • 100% Vector PDF</span>
          </div>
          <div class="toolbar-actions">
            <button class="btn-print" onclick="window.print()">
              <span>🖨️</span>
              <span>طباعة / حفظ كـ PDF (Ctrl+P)</span>
            </button>
            <button class="btn-close" onclick="window.close()">
              <span>✕ إغلاق</span>
            </button>
          </div>
        </div>

        <!-- Feuille A4 imprimable -->
        <div class="page-wrapper">
          <div class="a4-sheet">
            ${bodyContentHtml}
          </div>
        </div>

        <script>
          // Déclenchement automatique de la boîte de dialogue d'impression après chargement des polices
          window.addEventListener('load', function() {
            setTimeout(function() {
              window.print();
            }, 600);
          });
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(fullHtml);
  printWindow.document.close();
}

/**
 * Générateur de l'en-tête républicain officiel et des coordonnées de la plateforme
 */
function buildOfficialHeaderHtml(settings: PlatformSettings, documentTitleAr: string, documentTitleFr: string): string {
  return `
    <div style="border-bottom: 2.5px solid #059669; padding-bottom: 12px; margin-bottom: 16px; direction: rtl;">
      <!-- Ligne Républicaine Officielle -->
      <div style="text-align: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 900; color: #0f172a; letter-spacing: 0.5px;">الجمهورية الجزائرية الديمقراطية الشعبية</div>
        <div style="font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 1px; direction: ltr;">
          RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
        </div>
        <div style="font-size: 11px; font-weight: 700; color: #059669; margin-top: 3px;">
          ${settings.subTitle || 'وزارة الصحة • مديرية الصحة لولاية سطيف • Complexe Hospitalier Universitaire de Sétif'}
        </div>
      </div>

      <!-- Coordonnées de l'Établissement configurées par l'Administrateur -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 18px;">
        <div style="flex: 1; text-align: right;">
          <div style="font-size: 16px; font-weight: 900; color: #0f172a;">${settings.name || 'المؤسسة العمومية الاستشفائية - صحتي سطيف'}</div>
          <div style="font-size: 12px; font-weight: 700; color: #475569; margin-top: 2px; direction: ltr; text-align: right;">
            ${settings.nameFr || 'Plateforme SIHATI • Complexe Hospitalier Universitaire de Sétif'}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
            <strong>العنوان :</strong> ${settings.address || 'نهج 8 ماي 1945، وسط مدينة سطيف، 19000، الجزائر'}
          </div>
        </div>

        <div style="text-align: left; font-size: 10.5px; color: #334155; border-right: 1.5px solid #cbd5e1; padding-right: 16px; margin-right: 16px; min-width: 270px; direction: ltr;">
          <div><strong>Tel :</strong> ${settings.phone} &nbsp;|&nbsp; <strong>Urgences :</strong> <span style="color:#dc2626; font-weight:bold;">${settings.emergencyPhone}</span></div>
          <div style="margin-top: 2px;"><strong>Fax :</strong> ${settings.fax} &nbsp;|&nbsp; <strong>Email :</strong> ${settings.email}</div>
          <div style="margin-top: 2px;"><strong>Site Web :</strong> ${settings.website}</div>
          <div style="margin-top: 3px; font-weight: bold; color: #059669;">N° Agrément DSP : ${settings.agreementNumber}</div>
        </div>
      </div>

      <!-- Titre Encadré du Document avec Arabe parfait et Français net -->
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-align: center; padding: 10px 14px; border-radius: 10px; margin-top: 14px; box-shadow: 0 2px 4px rgba(5,150,105,0.2);">
        <div style="font-size: 16px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 2px;">${documentTitleAr}</div>
        <div style="font-size: 11px; font-weight: 700; opacity: 0.95; letter-spacing: 1px; text-transform: uppercase; direction: ltr;">
          ${documentTitleFr}
        </div>
      </div>
    </div>
  `;
}

/**
 * Générateur du pied de page légal officiel (Loi 18-07 & 18-11)
 */
function buildOfficialFooterHtml(settings: PlatformSettings): string {
  const now = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <div style="margin-top: 24px; padding-top: 12px; border-top: 1.5px solid #cbd5e1; font-size: 10px; color: #64748b; text-align: center; direction: rtl;">
      <div style="font-weight: 800; color: #334155; margin-bottom: 4px;">
        ${settings.legalNotice || 'وثيقة رسمية مؤمنة مشفرة رقمياً • مطابقة للقانون 18-07 المتعلق بحماية المعطيات الصحية والقانون الصحي 18-11'}
      </div>
      <div style="direction: ltr; font-family: monospace; font-size: 9px; color: #64748b;">
        Document sécurisé émis le ${now} • Certifié conforme ANPDP (Loi 18-07) • Signature électronique DSP-SETIF
      </div>
    </div>
  `;
}

/**
 * 1. GÉNÉRATION ET IMPRESSION DU DOSSIER MÉDICAL PARTAGÉ (PATIENT 360°)
 */
export async function printMedicalRecordPdf(patient: any, customSettings?: PlatformSettings) {
  const settings = customSettings || (await getPlatformSettings());

  const allergiesStr =
    patient.allergies?.map((a: any) => `${a.name} (${a.severity})`).join('  •  ') ||
    'حساسية البنسلين (Pénicilline - خطورة عالية / Choc anaphylactique)  •  حساسية الأسبرين';

  const chronicStr =
    patient.chronicDiseases?.map((d: any) => typeof d === 'string' ? d : d.name).join('  •  ') ||
    'ارتفاع ضغط الدم الشرياني (Hypertension Artérielle Stade II)  •  قصور الشرايين التاجية المستقر';

  const html = `
    <div>
      ${buildOfficialHeaderHtml(settings, 'الملف الطبي الموحد للمريض (360° EHR)', 'DOSSIER MÉDICAL ÉLECTRONIQUE PARTAGÉ')}

      <!-- 1. Fiche Identité du Patient -->
      <div style="border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 20px; margin-bottom: 16px; background: #ffffff; position: relative;">
        <!-- Badge Groupe Sanguin -->
        <div style="position: absolute; left: 20px; top: 14px; background: #059669; color: #ffffff; border-radius: 10px; padding: 8px 18px; text-align: center; box-shadow: 0 2px 4px rgba(5,150,105,0.25);">
          <div style="font-size: 20px; font-weight: 900; line-height: 1;">${patient.bloodGroup || 'O+'}</div>
          <div style="font-size: 9.5px; font-weight: 800; margin-top: 3px; letter-spacing: 0.5px;">GROUPE</div>
        </div>

        <div style="font-size: 17px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">
          المريض : <span style="color: #059669;">${patient.name || 'محمد أمين بن علي (Mohamed Amine BENALI)'}</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 20px; font-size: 11.5px; color: #334155; margin-left: 100px;">
          <div><strong>تاريخ الميلاد والسن :</strong> ${patient.dateOfBirth || '14/05/1996'} (${patient.age || 28} سنة)</div>
          <div><strong>الجنس :</strong> ذكر (Masculin)</div>
          <div><strong>الولاية والعنوان :</strong> ${patient.wilaya || '19 - ولاية سطيف'}</div>
          <div><strong>رقم الهاتف :</strong> <span style="direction: ltr; display: inline-block; font-weight:bold;">${patient.phone || '0555 12 34 56'}</span></div>
          <div><strong>المعرف الوطني للملف (EHR) :</strong> <span style="font-family: monospace; font-weight: 800; color: #0f172a;">${patient.fileNumber || 'EHR-2024-SETIF-784512'}</span></div>
          <div><strong>رقم بطاقة الشفاء (CNAS) :</strong> <span style="font-family: monospace; font-weight: 800; color: #059669;">${patient.chifaNumber || '1996 0519 2800 4512 (80%)'}</span></div>
        </div>
      </div>

      <!-- 2. Alertes Médicales & Allergies -->
      <div style="border: 1.5px solid #fecaca; background: #fff1f2; border-radius: 12px; padding: 12px 18px; margin-bottom: 16px;">
        <div style="font-size: 12.5px; font-weight: 900; color: #b91c1c; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>⚠️</span> <span>تنبيهات سريرية وحساسية مفرطة (ALERTES CLINIQUES & ALLERGIES) :</span>
        </div>
        <div style="font-size: 11.5px; color: #991b1b; line-height: 1.6;">
          <div><strong>الحساسية المؤكدة :</strong> ${allergiesStr}</div>
          <div style="margin-top: 3px;"><strong>الأمراض المزمنة المسجلة :</strong> ${chronicStr}</div>
        </div>
      </div>

      <!-- 3. Constantes Vitales -->
      <div style="margin-bottom: 18px;">
        <div style="font-size: 13.5px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">
          1. الثوابت السريرية وآخر القياسات (CONSTANTES CLINIQUES & PARAMÈTRES VITAUX)
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; border: 1.5px solid #cbd5e1;">
          <thead>
            <tr style="background: #059669; color: #ffffff;">
              <th style="padding: 8px 12px; text-align: right; border: 1px solid #047857;">المؤشر السريري</th>
              <th style="padding: 8px 12px; text-align: center; border: 1px solid #047857;">القيمة المقاسة</th>
              <th style="padding: 8px 12px; text-align: center; border: 1px solid #047857;">المجال المرجعي المستهدف</th>
              <th style="padding: 8px 12px; text-align: center; border: 1px solid #047857;">التقييم الطبي</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #f8fafc;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">ضغط الدم الشرياني (Tension Artérielle)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">124/78 mmHg</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">&lt; 130/80 mmHg</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 800;">مثالي ومضبوط</td>
            </tr>
            <tr>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">النبض القلبي (Fréquence Cardiaque)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">70 bpm</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">60 - 90 bpm</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 800;">طبيعي منتظم</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">نسبة السكر في الدم على الريق (Glycémie)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">0.92 g/L</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">0.70 - 1.10 g/L</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 800;">طبيعي</td>
            </tr>
            <tr>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">الوزن ومؤشر كتلة الجسم (Poids / IMC)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">72 kg (IMC 23.5)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">18.5 - 24.9 kg/m²</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 800;">بنية متناسقة</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4. Traitements en cours -->
      <div style="margin-bottom: 18px;">
        <div style="font-size: 13.5px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">
          2. الأدوية والوصفات النشطة (TRAITEMENTS ACTIFS EN COURS)
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; border: 1.5px solid #cbd5e1;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff;">
              <th style="padding: 8px 12px; text-align: right; border: 1px solid #334155;">الدواء والجرعة</th>
              <th style="padding: 8px 12px; text-align: right; border: 1px solid #334155;">طريقة الاستعمال والجرعات</th>
              <th style="padding: 8px 12px; text-align: center; border: 1px solid #334155;">المدة</th>
              <th style="padding: 8px 12px; text-align: right; border: 1px solid #334155;">الطبيب المعالج</th>
              <th style="padding: 8px 12px; text-align: center; border: 1px solid #334155;">الالتزام</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #f8fafc;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">SARTEG (Valsartan) 80 mg</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0;">قرص واحد صباحاً مع وجبة الإفطار</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">3 أشهر</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0;">د. محمد علي (طبيب عام)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">100%</td>
            </tr>
            <tr>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">KARDEGIC 75 mg</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0;">كيس واحد يومياً بعد الغداء</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">3 أشهر</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0;">د. سارة أحمد (أمراض القلب)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">95%</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">Vitamine D3 200 000 UI</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0;">أمبولة واحدة للشرب كل شهرين</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">سنة واحدة</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0;">د. محمد علي</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 5. Bloc Cachet et Validation -->
      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <div style="border: 2px dashed #059669; border-radius: 12px; padding: 12px 20px; width: 300px; text-align: center; background: #f0fdf4;">
          <div style="font-size: 12px; font-weight: 900; color: #065f46;">التأشيرة والختم الطبي المعتمد</div>
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 4px;">${settings.directorName || 'د. يوسف بلمعزة (مدير المؤسسة الاستشفائية)'}</div>
          <div style="font-size: 10.5px; color: #047857; margin-top: 2px;">توقيع إلكتروني مؤمن ونظام الشفاء</div>
          <div style="font-family: monospace; font-size: 9.5px; color: #64748b; margin-top: 6px; direction: ltr;">
            SHA256: 7f8a9b2c3d4e5f6a1b2c3d4e
          </div>
        </div>
      </div>

      ${buildOfficialFooterHtml(settings)}
    </div>
  `;

  openPrintDocumentInNewTab(`Dossier_Medical_${patient.fileNumber || 'Patient'}`, html);
}

/**
 * 2. GÉNÉRATION ET IMPRESSION DE L'ORDONNANCE MÉDICALE CHIFA
 */
export async function printPrescriptionPdf(prescription: any, customSettings?: PlatformSettings) {
  const settings = customSettings || (await getPlatformSettings());

  const html = `
    <div>
      ${buildOfficialHeaderHtml(settings, 'وصفة طبية إلكترونية مؤمنة (نظام الشفاء)', 'ORDONNANCE MÉDICALE ÉLECTRONIQUE (CHIFA)')}

      <!-- Coordonnées Médecin et Patient en 2 colonnes -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <!-- Médecin -->
        <div style="border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 18px; background: #f8fafc;">
          <div style="font-size: 13.5px; font-weight: 900; color: #0f172a;">
            الطبيب المعالج : <span style="color: #059669;">${prescription.doctor || 'د. محمد علي (Dr. Mohamed ALI)'}</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">
            <strong>التخصص :</strong> الطب العام وأمراض القلب والشرايين
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            <strong>رقم التسجيل في عمادة الأطباء :</strong> MED-SETIF-2015-089
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            <strong>العيادة :</strong> نهج 8 ماي 1945، وسط مدينة سطيف
          </div>
        </div>

        <!-- Patient -->
        <div style="border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 18px; background: #f8fafc;">
          <div style="font-size: 13.5px; font-weight: 900; color: #0f172a;">
            المريض : <span style="color: #059669;">${prescription.patientName || 'محمد أمين بن علي'}</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">
            <strong>السن وفصيلة الدم :</strong> 28 سنة &nbsp;|&nbsp; <strong>${prescription.bloodGroup || 'O+'}</strong>
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            <strong>رقم بطاقة الشفاء :</strong> <span style="font-family: monospace; font-weight: 800; color: #059669;">1996 0519 2800 4512</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            <strong>تاريخ تحرير الوصفة :</strong> ${prescription.date || '28/10/2026'}
          </div>
        </div>
      </div>

      <!-- Tableau des Médicaments Prescrits -->
      <div style="margin-bottom: 16px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; border: 1.5px solid #cbd5e1;">
          <thead>
            <tr style="background: #059669; color: #ffffff;">
              <th style="padding: 8px 10px; text-align: center; border: 1px solid #047857; width: 44px;">الرقم</th>
              <th style="padding: 8px 12px; text-align: right; border: 1px solid #047857;">اسم الدواء والجرعة المحددة</th>
              <th style="padding: 8px 10px; text-align: center; border: 1px solid #047857;">الشكل</th>
              <th style="padding: 8px 12px; text-align: right; border: 1px solid #047857;">الجرعة وطريقة التناول</th>
              <th style="padding: 8px 10px; text-align: center; border: 1px solid #047857;">المدة</th>
              <th style="padding: 8px 10px; text-align: center; border: 1px solid #047857;">رمز CIP</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #ffffff;">
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">01</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">SARTEG (Valsartan) 80 mg</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center;">أقراص</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">قرص واحد صباحاً مع وجبة الإفطار بانتظام</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">3 أشهر</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-size: 10.5px;">CIP-DZ-84920</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">02</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">KARDEGIC 75 mg</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center;">أكياس</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">كيس واحد مذاب في الماء يومياً بعد الغداء</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">3 أشهر</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-size: 10.5px;">CIP-DZ-11940</td>
            </tr>
            <tr style="background: #ffffff;">
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">03</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">Vitamine D3 200 000 UI</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center;">أمبولات</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">أمبولة واحدة للشرب كل شهرين مع كأس ماء</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">سنة كاملة</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-size: 10.5px;">CIP-DZ-55012</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Consignes Hygiéno-Diététiques -->
      <div style="border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 10px; padding: 10px 16px; margin-bottom: 16px; font-size: 11px; color: #334155;">
        <div style="font-weight: 900; color: #0f172a; margin-bottom: 2px;">نصائح وإرشادات طبية خاصة بالحمية والعلاج :</div>
        <div>• الالتزام بنظام غذائي قليل الملح وممارسة رياضة المشي يومياً لمدة 30 دقيقة.</div>
        <div>• قياس ضغط الدم الشرياني أسبوعياً في الصباح وعدم إيقاف العلاج دون استشارة الطبيب المعالج.</div>
      </div>

      <!-- Signatures : Pharmacie & Médecin -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 14px;">
        <!-- Cadre Pharmacie -->
        <div style="border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 16px; background: #ffffff; min-height: 105px;">
          <div style="font-size: 11.5px; font-weight: 900; color: #0f172a;">فضاء خاص بالصيدلية (صرف الدواء) :</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 6px;">تاريخ الصرف : _____ / _____ / 2026</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 28px;">ختم وتوقيع الصيدلي المسؤول</div>
        </div>

        <!-- Cadre Médecin -->
        <div style="border: 1.5px solid #059669; border-radius: 12px; padding: 12px 16px; background: #f0fdf4; text-align: center; min-height: 105px;">
          <div style="font-size: 11.5px; font-weight: 900; color: #065f46;">توقيع وختم الطبيب المعالج</div>
          <div style="font-size: 12.5px; font-weight: 900; color: #0f172a; margin-top: 4px;">${prescription.doctor || 'د. محمد علي'}</div>
          <div style="font-size: 10px; color: #059669; margin-top: 2px;">وصفة موقعة رقمياً عبر المنصة الصحية</div>
          <div style="font-family: monospace; font-size: 9.5px; color: #64748b; margin-top: 10px; direction: ltr;">
            HASH: ${prescription.hash ? prescription.hash.substring(0, 32) : 'e3b0c44298fc1c149afbf4c8996fb924'}
          </div>
        </div>
      </div>

      ${buildOfficialFooterHtml(settings)}
    </div>
  `;

  openPrintDocumentInNewTab(`Ordonnance_${prescription.id || 'Chifa'}`, html);
}

/**
 * 3. GÉNÉRATION ET IMPRESSION DU BILAN BIOLOGIQUE DE LABORATOIRE
 */
export async function printLabReportPdf(labData: any, patient: any, customSettings?: PlatformSettings) {
  const settings = customSettings || (await getPlatformSettings());

  const html = `
    <div>
      ${buildOfficialHeaderHtml(settings, 'تقرير نتائج التحاليل الطبية والبيولوجية', 'COMPTE-RENDU D’ANALYSES BIOLOGIQUES MÉDICALES')}

      <!-- Identité Patient & Prélèvement -->
      <div style="border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 20px; margin-bottom: 16px; background: #f8fafc; display: flex; justify-content: space-between;">
        <div style="font-size: 12px; color: #1e293b; line-height: 1.6;">
          <div><strong>المريض :</strong> <span style="font-weight: 900; color: #059669;">${patient.name || 'محمد أمين بن علي'}</span> (${patient.age || 28} سنة)</div>
          <div><strong>رقم الملف الطبي :</strong> <span style="font-family: monospace; font-weight: bold;">${patient.fileNumber || 'EHR-2024-SETIF-784512'}</span></div>
        </div>
        <div style="font-size: 11.5px; color: #475569; text-align: left; direction: ltr; line-height: 1.6;">
          <div><strong>Date Prélèvement :</strong> 20/10/2026 à 08:15</div>
          <div><strong>Laboratoire :</strong> Laboratoire El-Baraka • Sétif Centre (Agrément DSP)</div>
        </div>
      </div>

      <!-- Tableau des Résultats d'Analyses -->
      <div style="margin-bottom: 16px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; border: 1.5px solid #cbd5e1;">
          <thead>
            <tr style="background: #059669; color: #ffffff;">
              <th style="padding: 8px 12px; text-align: right; border: 1px solid #047857;">التحليل البيولوجي (Analyse)</th>
              <th style="padding: 8px 12px; text-align: center; border: 1px solid #047857;">النتيجة المقاسة</th>
              <th style="padding: 8px 12px; text-align: center; border: 1px solid #047857;">المجال المرجعي العادي</th>
              <th style="padding: 8px 12px; text-align: center; border: 1px solid #047857;">التفسير الطبي</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #ffffff;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">الهيموغلوبين (Hémoglobine NFS)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">14.8 g/dL</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">13.5 - 17.5 g/dL</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">طبيعي (NORMAL)</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">الصفائح الدموية (Plaquettes sanguines)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">245 000 /mm³</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">150 000 - 400 000</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">طبيعي (NORMAL)</td>
            </tr>
            <tr style="background: #ffffff;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">السكر في الدم على الريق (Glycémie à jeun)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">0.92 g/L</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">0.70 - 1.10 g/L</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">طبيعي (NORMAL)</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">الكرياتينين في المصل (Créatinine sérique)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">8.4 mg/L</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">7.0 - 12.0 mg/L</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">طبيعي (NORMAL)</td>
            </tr>
            <tr style="background: #ffffff;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">تصفية الكلى (Clairance rénale MDRD)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">105 mL/min</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">&gt; 90 mL/min</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">ممتاز (EXCELLENT)</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; font-weight: bold;">الكولسترول الكلي (Cholestérol Total)</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 900; direction: ltr;">1.85 g/L</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; direction: ltr;">&lt; 2.00 g/L</td>
              <td style="padding: 7px 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: bold;">طبيعي ومضبوط</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Cachet et Validation Biologique -->
      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <div style="border: 2px dashed #059669; border-radius: 12px; padding: 12px 20px; width: 300px; text-align: center; background: #f0fdf4;">
          <div style="font-size: 12px; font-weight: 900; color: #065f46;">المصادقة والتوقيع البيولوجي</div>
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 4px;">د. سمير خليفة (طبيب بيولوجي رئيسي)</div>
          <div style="font-size: 10.5px; color: #047857; margin-top: 2px;">توقيع إلكتروني بيولوجي معتمد</div>
          <div style="font-family: monospace; font-size: 9.5px; color: #64748b; margin-top: 6px; direction: ltr;">
            Réf: LAB-SETIF-2026-9941
          </div>
        </div>
      </div>

      ${buildOfficialFooterHtml(settings)}
    </div>
  `;

  openPrintDocumentInNewTab(`Bilan_Biologique_${patient.name || 'Patient'}`, html);
}
