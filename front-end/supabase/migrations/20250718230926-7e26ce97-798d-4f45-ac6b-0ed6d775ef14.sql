-- Create the demo user for testing
-- First, we'll create a demo user in the auth system
-- Note: This approach uses a different method since we cannot directly insert into auth.users

-- Create a function to handle demo user creation
CREATE OR REPLACE FUNCTION create_demo_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function will be used to create demo data
  -- The actual user creation will need to be done via Supabase Auth API
  -- For now, we'll create the associated customer and profile records
  
  -- Insert demo customer (this will be referenced when user signs up)
  INSERT INTO public.customers (id, name, email, phone, newsletter_signup)
  VALUES (
    'demo-customer-uuid'::uuid,
    'Demo User',
    'demo@cafefausse.com',
    '(555) 123-4567',
    false
  )
  ON CONFLICT (email) DO NOTHING;
  
  -- Note: The auth user will be created when they first sign up
  -- This just ensures the customer record exists
END;
$$;

-- Execute the function
SELECT create_demo_user();

-- Clean up the function
DROP FUNCTION create_demo_user();