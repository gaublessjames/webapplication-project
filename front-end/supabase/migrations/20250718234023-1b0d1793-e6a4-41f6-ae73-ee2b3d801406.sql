-- Create function to count available tables for a specific date and time
CREATE OR REPLACE FUNCTION public.count_available_tables(p_date date, p_time time without time zone)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  total_tables INTEGER := 30; -- Total number of tables in restaurant
  booked_tables INTEGER;
BEGIN
  -- Count tables that are already booked for this date/time
  SELECT COUNT(*) INTO booked_tables
  FROM public.reservations
  WHERE reservation_date = p_date
  AND reservation_time = p_time
  AND status = 'confirmed';
  
  -- Return available tables
  RETURN total_tables - booked_tables;
END;
$function$;