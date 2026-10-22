-- Migration: add role to ecom_customers
-- Roles: 'student' (default), 'collaborator', 'admin'
ALTER TABLE ecom_customers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- Grant admin access to a specific email (adapt before running):
-- UPDATE ecom_customers SET role = 'admin' WHERE email = 'admin@votre-domaine.com';

-- Grant collaborator access:
-- UPDATE ecom_customers SET role = 'collaborator' WHERE email = 'formateur@votre-domaine.com';

CREATE INDEX IF NOT EXISTS idx_ecom_customers_role ON ecom_customers (role);
