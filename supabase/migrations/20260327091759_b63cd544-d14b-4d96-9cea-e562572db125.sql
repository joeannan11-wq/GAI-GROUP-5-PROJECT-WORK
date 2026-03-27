
-- Schools table
CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  region text NOT NULL,
  type text NOT NULL DEFAULT 'SHS',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read schools" ON public.schools
  FOR SELECT TO anon, authenticated USING (true);

-- Question bank table (pre-made GES syllabus questions)
CREATE TABLE public.question_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  grade text NOT NULL,
  topic text NOT NULL,
  type text NOT NULL,
  text text NOT NULL,
  options jsonb,
  correct_answer text,
  marks integer NOT NULL DEFAULT 1,
  difficulty text NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read question bank" ON public.question_bank
  FOR SELECT TO authenticated USING (true);
