-- Update reservations table to optionally link to authenticated users
ALTER TABLE public.reservations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT NULL;

-- Create index for faster lookups by user_id
CREATE INDEX idx_reservations_user_id ON public.reservations(user_id);

-- Create index for faster lookups by customer email (for linking reservations)
CREATE INDEX idx_customers_email ON public.customers(email);

-- Create RLS policy to allow users to see their own reservations
CREATE POLICY "Users can view their own reservations" 
ON public.reservations 
FOR SELECT 
USING (
  -- Allow if reservation belongs to authenticated user
  auth.uid() = user_id 
  OR 
  -- Allow if reservation email matches authenticated user's email
  EXISTS (
    SELECT 1 FROM public.customers c 
    WHERE c.id = customer_id 
    AND c.email = auth.email()
  )
);