/*
  # Create donations table for tracking donation statistics

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `amount` (numeric, donation amount)
      - `currency` (text, RSD or EUR)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `donations` table
    - Add policy for anyone to insert donations (anonymous tracking)
    - Add policy for authenticated users to read donations (for analytics)
*/

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL,
  currency text NOT NULL CHECK (currency IN ('RSD', 'EUR')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit donations"
  ON donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better performance on analytics queries
CREATE INDEX IF NOT EXISTS idx_donations_currency ON donations(currency);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);