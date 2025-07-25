-- Add unique constraint to email in customers table
ALTER TABLE public.customers ADD CONSTRAINT customers_email_unique UNIQUE (email);

-- Now insert the demo customer record
INSERT INTO public.customers (name, email, phone, newsletter_signup)
VALUES (
  'Demo User',
  'demo@cafefausse.com',
  '(555) 123-4567',
  false
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone;