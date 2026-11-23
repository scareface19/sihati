# مشروع ستارتاب « صحّتي » (SIHATI) 🇩🇿

> **المنظومة الرقمية الصحية الموحدة للمريض والطبيب في الجزائر**  
> **Zone pilote :** ولاية سطيف (Sétif)  
> **الطالبتان :** بلقيس عيساوي (Balqis Issaoui) & خولة عزوزي (Khaoula Azzouzi)  
> **المشرفون :** أ. قدور صابرينة • أ. نوري حكيم • أ. حراك ناصية  

---

## 🏗️ البنية التقنية للمشروع (Architecture Technique)

| الطبقة (Couche) | التقنية المختارة (Stack) | الوظيفة الأساسية |
| :--- | :--- | :--- |
| **Backend API** | **NestJS (TypeScript)** + TypeORM | API RESTful، تشفير البيانات، إدارة الصلاحيات JWT، توثيق Swagger |
| **Base de Données** | **MySQL 8.0+** (Réelle, sans Docker) | 13 جدولاً مترابطاً مع قيود التكامل المرجعي وفهارس البحث السريع |
| **Portail Web Médecin** | **Next.js 14+ (App Router)** + Tailwind CSS | لوحة تحكم الطبيب، تحرير الوصفات الرقمية بـ QR، والتحقق من موافقة المريض (OTP) |
| **Application Mobile** | **React Native (Expo SDK 51)** + NativeWind | تطبيق المريض: ملف صحي (15 تخصص)، زر طوارئ SOS، تذكير الأدوية، حساب عائلي |
| **Nomenclature 2025** | **560 دواء جزائري مسجل** | قاعدة بيانات الأدوية الوطنية الصادرة عن وزارة الصناعة الصيدلانية |

---

## 🗄️ 1. قاعدة البيانات الحقيقية MySQL (`data/`)

- `data/schema.sql` : السكريبت الكامل لإنشاء قاعدة البيانات `sihati_db` والجداول الـ 13 :
  1. `users` : المستخدمين (PATIENT, DOCTOR, ADMIN, PHARMACY)
  2. `patients` : المرضى، فصيلة الدم، الحساسية، الأمراض المزمنة
  3. `emergency_contacts` : جهات الاتصال في حالات الطوارئ
  4. `doctors` : الأطباء، التخصص، العنوان، سعر الكشف
  5. `medications` : الـ 560 دواء مسجل رسمياً في الجزائر لسنة 2025
  6. `appointments` : المواعيد الطبية وحالاتها
  7. `medical_records` : استشارات الملف الطبي الموزعة على 15 تخصصاً
  8. `prescriptions` : الوصفات الإلكترونية المشفرة بـ QR Code
  9. `prescription_items` : تفاصيل وجرعات كل دواء
  10. `self_medications` : العلاج الذاتي (الأعشاب والمكملات)
  11. `medical_documents` : التقارير والتحاليل وصور الأشعة
  12. `access_consents` : سجل الموافقات ورموز OTP (قانون 18-07)
  13. `emergency_alerts` : سجل استغاثات زر SOS مع الإحداثيات الجغرافية

- `data/seed_data.sql` : سكريبت الإدراج المباشر لجميع الأدوية والحسابات التجريبية.

---

## 🚀 2. تشغيل الـ Backend (NestJS API)

```bash
cd d:\Sihati\backend

# تثبيت الحزم (Installation)
npm install

# تشغيل الخادم في وضع التطوير (Port 3001)
npm run start:dev
```

- **رابط توثيق الـ API (Swagger UI) :** `http://localhost:3001/api/docs`
- **رابط الاستدعاء لملء قاعدة البيانات تلقائياً :** `http://localhost:3001/seed/init`

### حسابات الدخول التجريبية (Comptes Démo) :
- **الطبيب :** البريد `dr.ali@sihati.dz` • كلمة المرور: `password123`
- **المريض :** الهاتف `0555123456` • كلمة المرور: `password123`

---

## 💻 3. تشغيل منصة الطبيب (Next.js Web Portal)

```bash
cd d:\Sihati\web

# تثبيت الحزم
npm install

# تشغيل المنصة (Port 3000)
npm run dev
```

- **الصفحة الرئيسية :** `http://localhost:3000`
- **تسجيل الدخول :** `http://localhost:3000/login`
- **لوحة تحكم الطبيب :** `http://localhost:3000/dashboard`
- **تحرير وصفة طبية ذكية بالرمز QR :** `http://localhost:3000/prescriptions/new`
- **ملف الطوارئ SOS العام للحماية المدنية (14) :** `http://localhost:3000/emergency/sihati-sos-token-2024-784512`
- **مجتمع الأطباء ومناقشة الحالات :** `http://localhost:3000/peer-community`

---

## 📱 4. تشغيل تطبيق الهاتف للمريض (React Native Expo)

```bash
cd d:\Sihati\mobile

# تثبيت الحزم
npm install

# تشغيل خادم Expo
npx expo start
```

يمكن تجربة التطبيق مباشرة عبر هاتفك الذكي باستخدام تطبيق **Expo Go** (بمسح رمز QR الظاهر في الطرفية) أو على المتصفح بالضغط على المفتاح `w`.

---

## 🔒 5. الامتثال القانوني والأمني (Loi 18-07)

- **الملكية التامة للمريض :** المريض هو المالك القانوني الحصري لملفه الصحي.
- **إذن الوصول المؤقت (OTP) :** لا يمكن للطبيب تصفح الملف الطبي إلا بعد طلب وتأكيد رمز أمان (OTP) صالح لمدة ساعتين فقط خلال وقت الاستشارة.
- **التشفير :** تخزين البيانات الحساسة وفق معيار التشفير المتقدم **AES-256**.
