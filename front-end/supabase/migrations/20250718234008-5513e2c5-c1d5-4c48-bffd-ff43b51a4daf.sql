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
$function$

-- Create function to check if booking is possible
CREATE OR REPLACE FUNCTION public.check_booking_availability(p_date date, p_time time without time zone)
RETURNS json
LANGUAGE plpgsql
AS $function$
DECLARE
  available_tables INTEGER;
  result JSON;
BEGIN
  -- Get available table count
  SELECT public.count_available_tables(p_date, p_time) INTO available_tables;
  
  -- Return result with availability info
  result := json_build_object(
    'available', available_tables > 0,
    'remaining_tables', available_tables,
    'message', 
    CASE 
      WHEN available_tables = 0 THEN 'No tables available for this time'
      WHEN available_tables <= 3 THEN 'Only ' || available_tables || ' tables left!'
      ELSE available_tables || ' tables available'
    END
  );
  
  RETURN result;
END;
$function$