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
$function$;