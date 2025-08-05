/*
  # Create background music table

  1. New Tables
    - `background_music`
      - `id` (uuid, primary key)
      - `title` (text) - naziv pesme
      - `file_url` (text) - URL do MP3 fajla u Supabase Storage
      - `is_active` (boolean) - da li je pesma trenutno aktivna
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `background_music` table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage music

  3. Storage
    - Create storage bucket for music files
*/

-- Create background_music table
CREATE TABLE IF NOT EXISTS background_music (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_url text NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE background_music ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read background music"
  ON background_music
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage background music"
  ON background_music
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for music files
INSERT INTO storage.buckets (id, name, public)
VALUES ('background-music', 'background-music', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Public can view music files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'background-music');

-- Create storage policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload music files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'background-music');

-- Create storage policy for authenticated users to update
CREATE POLICY "Authenticated users can update music files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'background-music');

-- Create storage policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete music files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'background-music');