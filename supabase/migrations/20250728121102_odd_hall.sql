-- Fix grammar for Kathisma 4 display
UPDATE public.kathismas 
SET psalms_range = 'Псалме 24-31'
WHERE id = 4;