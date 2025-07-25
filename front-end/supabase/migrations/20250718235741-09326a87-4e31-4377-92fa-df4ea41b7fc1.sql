-- Create table to store reservation emails
CREATE TABLE public.reservation_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('receipt', 'confirmation', 'notification')),
  reservation_id UUID,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reservation_emails ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can view all emails" 
ON public.reservation_emails 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert emails" 
ON public.reservation_emails 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Staff can update emails" 
ON public.reservation_emails 
FOR UPDATE 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_reservation_emails_updated_at
BEFORE UPDATE ON public.reservation_emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();