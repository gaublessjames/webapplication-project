-- Create a customer record for the demo user
-- We'll use a proper UUID and handle conflicts properly

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