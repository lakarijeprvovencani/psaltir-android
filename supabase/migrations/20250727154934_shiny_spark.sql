/*
  # Insert background music record

  1. Data
    - Insert the uploaded MP3 file record into background_music table
    - Set as active background music
    - Title: "Anixandaria" (based on filename)
*/

INSERT INTO background_music (title, file_url, is_active) 
VALUES (
  'Anixandaria',
  'https://zabgchwtarnloaieysam.supabase.co/storage/v1/object/public/background-music//01_Anixandaria.mp3',
  true
);