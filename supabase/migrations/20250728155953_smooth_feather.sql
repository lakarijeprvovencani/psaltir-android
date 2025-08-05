/*
  # Create Akatist table

  1. New Tables
    - `akatist`
      - `id` (integer, primary key)
      - `title` (text, not null) - Назив акатиста
      - `subtitle` (text, not null) - Поднаслов
      - `content` (text[], default empty array) - Садржај акатиста подељен у стихове
      - `category` (text, not null) - Категорија (нпр. 'bogorodica', 'isus', 'sveti')
      - `feast_day` (text, nullable) - Празник када се чита
      - `note` (text, nullable) - Додатне напомене
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `akatist` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS akatist (
  id integer PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  content text[] NOT NULL DEFAULT '{}',
  category text NOT NULL,
  feast_day text,
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE akatist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read akatist"
  ON akatist
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_akatist_category ON akatist(category);
CREATE INDEX IF NOT EXISTS idx_akatist_title ON akatist(title);