-- ========================================================
-- Base de Données "صحّتي" (SIHATI) - MySQL 8.0+
-- Système de Santé Numérique Algérien
-- ========================================================

CREATE DATABASE IF NOT EXISTS sihati_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sihati_db;

-- 1. Table Utilisateurs (Authentification et Rôles)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN', 'PHARMACY') NOT NULL DEFAULT 'PATIENT',
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- 2. Table Profil Patient
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    parent_id INT NULL, -- Pour le Compte Famille (gestion enfants/personnes âgées)
    date_of_birth DATE NULL,
    gender ENUM('M', 'F') NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NULL,
    height_cm DECIMAL(5,2) NULL,
    weight_kg DECIMAL(5,2) NULL,
    wilaya VARCHAR(50) NOT NULL DEFAULT 'Sétif',
    commune VARCHAR(50) NULL,
    chronic_diseases TEXT NULL,
    allergies TEXT NULL,
    emergency_token VARCHAR(64) UNIQUE NOT NULL, -- Token sécurisé pour accès SOS sans connexion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES patients(id) ON DELETE SET NULL,
    INDEX idx_emergency_token (emergency_token)
) ENGINE=InnoDB;

-- 3. Table Contacts d'Urgence (SOS)
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    relation VARCHAR(50) NOT NULL, -- Mère, Père, Frère, Conjoint, etc.
    phone VARCHAR(20) NOT NULL,
    priority_order INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Table Profil Médecin
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    license_number VARCHAR(50) UNIQUE NOT NULL, -- N° Ordre des médecins
    specialty VARCHAR(100) NOT NULL,
    wilaya VARCHAR(50) NOT NULL DEFAULT 'Sétif',
    commune VARCHAR(50) NOT NULL,
    clinic_address TEXT NOT NULL,
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 1500.00,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    bio TEXT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_specialty_wilaya (specialty, wilaya)
) ENGINE=InnoDB;

-- 5. Table des Médicaments (Nomenclature Officielle Algérienne 2025)
CREATE TABLE IF NOT EXISTS medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(50) NOT NULL, -- ex: 352/01 A 003/06/22
    code VARCHAR(30) NOT NULL,                -- ex: 01 A 003
    dci VARCHAR(255) NOT NULL,                -- Dénomination Commune Internationale
    brand_name VARCHAR(150) NOT NULL,         -- Nom de marque (ARTIZ, DOLIPRANE, etc.)
    form VARCHAR(150) NOT NULL,               -- Forme (Comprimé, Sirop, Injectable...)
    dosage VARCHAR(100) NOT NULL,             -- 500MG, 10MG/ML, etc.
    packaging VARCHAR(100) NOT NULL,          -- B/20, FL/125ML...
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_brand_name (brand_name),
    INDEX idx_dci (dci)
) ENGINE=InnoDB;

-- 6. Table des Rendez-vous
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    reason VARCHAR(255) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_doctor_schedule (doctor_id, appointment_date)
) ENGINE=InnoDB;

-- 7. Table des Dossiers et Consultations par Spécialité (15 Spécialités Médicales)
CREATE TABLE IF NOT EXISTS medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    specialty VARCHAR(100) NOT NULL, -- 'Médecine Générale', 'Cardiologie', 'Pédiatrie', etc.
    diagnosis TEXT NOT NULL,
    clinical_notes TEXT NULL,
    treatment_plan TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_specialty (specialty)
) ENGINE=InnoDB;

-- 8. Table des Ordonnances Électroniques
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    qr_code_hash VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('ACTIVE', 'DISPENSED', 'EXPIRED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Table Lignes d'Ordonnance
CREATE TABLE IF NOT EXISTS prescription_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    medication_id INT NULL,
    custom_medication_name VARCHAR(150) NULL,
    dosage_instructions VARCHAR(255) NOT NULL, -- ex: "1 comprimé 3 fois par jour après repas"
    duration VARCHAR(50) NOT NULL,             -- ex: "7 jours"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. Table Automédication Déclarée par le Patient (العلاج الذاتي)
CREATE TABLE IF NOT EXISTS self_medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    product_type ENUM('OTC', 'SUPPLEMENT', 'HERBAL', 'TRADITIONAL') NOT NULL DEFAULT 'OTC',
    reason TEXT NULL,
    dosage VARCHAR(100) NULL,
    frequency VARCHAR(100) NULL,
    started_at DATE NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Documents Médicaux (Analyses, Radios, Scanners)
CREATE TABLE IF NOT EXISTS medical_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    document_type ENUM('LAB_RESULT', 'XRAY', 'SCANNER', 'REPORT', 'OTHER') NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    uploaded_by ENUM('PATIENT', 'DOCTOR', 'LAB') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Demandes d'accès au dossier patient (Consentement temporaire OTP/QR)
CREATE TABLE IF NOT EXISTS access_consents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    otp_code VARCHAR(6) NULL,
    status ENUM('PENDING', 'GRANTED', 'EXPIRED', 'REVOKED') DEFAULT 'PENDING',
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_otp (otp_code)
) ENGINE=InnoDB;

-- 13. Alertes d'Urgence SOS (Historique & Événements)
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address_description VARCHAR(255) NULL,
    status ENUM('ACTIVE', 'RESOLVED', 'FALSE_ALARM') DEFAULT 'ACTIVE',
    notified_contacts_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;
