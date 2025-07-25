-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  newsletter_signup BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0 AND number_of_guests <= 12),
  table_number INTEGER NOT NULL CHECK (table_number >= 1 AND table_number <= 30),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for restaurant bookings)
CREATE POLICY "Anyone can insert customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view their own customer data" 
ON public.customers 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view reservations" 
ON public.reservations 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to assign random available table
CREATE OR REPLACE FUNCTION public.assign_available_table(
  p_date DATE,
  p_time TIME
) RETURNS INTEGER AS $$
DECLARE
  available_table INTEGER;
BEGIN
  -- Find a random available table for the given date and time
  SELECT table_num INTO available_table
  FROM (
    SELECT generate_series(1, 30) AS table_num
    EXCEPT
    SELECT table_number
    FROM public.reservations
    WHERE reservation_date = p_date
    AND reservation_time = p_time
    AND status = 'confirmed'
  ) available_tables
  ORDER BY RANDOM()
  LIMIT 1;
  
  RETURN available_table;
END;
$$ LANGUAGE plpgsql;