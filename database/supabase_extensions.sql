-- Extensions optionnelles pour aligner la base avec le cahier des charges (à exécuter sur Supabase / DatabasePad).
-- Quiz : limite de tentatives
ALTER TABLE lms_quizzes ADD COLUMN IF NOT EXISTS max_attempts integer;

COMMENT ON COLUMN lms_quizzes.max_attempts IS 'Nombre max de tentatives (NULL ou 0 = illimité).';

-- Modules : déblocage séquentiel (désactivable par module)
ALTER TABLE lms_modules ADD COLUMN IF NOT EXISTS sequential_unlock boolean DEFAULT true;

-- Leçons : pièces jointes téléchargeables [{ "label": "...", "url": "https://..." }]
ALTER TABLE lms_lessons ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- Inscriptions : accès limité dans le temps (NULL = illimité)
ALTER TABLE lms_enrollments ADD COLUMN IF NOT EXISTS access_expires_at timestamptz;

-- Coupons e-commerce (optionnel)
CREATE TABLE IF NOT EXISTS ecom_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  percent_off integer,
  amount_off integer,
  active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE ecom_coupons IS 'Codes promo : percent_off OU amount_off (centimes), pas les deux obligatoires.';

CREATE INDEX IF NOT EXISTS idx_ecom_coupons_code ON ecom_coupons (code);

-- Exemple (à supprimer ou adapter en production)
INSERT INTO ecom_coupons (code, percent_off, active)
VALUES ('BIENVENUE10', 10, true)
ON CONFLICT (code) DO NOTHING;
