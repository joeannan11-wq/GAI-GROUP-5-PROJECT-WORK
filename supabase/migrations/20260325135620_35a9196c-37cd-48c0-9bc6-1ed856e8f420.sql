
-- Exam questions table (stores individual questions for published exams)
CREATE TABLE public.exam_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.published_exams(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'short', 'essay')),
  text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  marks INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student exam submissions
CREATE TABLE public.student_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.published_exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  total_marks INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  UNIQUE(exam_id, student_id)
);

-- Add school column to published_exams for school-specific filtering
ALTER TABLE public.published_exams ADD COLUMN IF NOT EXISTS school TEXT;

-- RLS for exam_questions
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions for active exams"
  ON public.exam_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.published_exams WHERE id = exam_id AND is_active = true)
  );

CREATE POLICY "Teachers manage own exam questions"
  ON public.exam_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.published_exams WHERE id = exam_id AND teacher_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.published_exams WHERE id = exam_id AND teacher_id = auth.uid())
  );

-- RLS for student_submissions
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own submissions"
  ON public.student_submissions FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can read submissions for own exams"
  ON public.student_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.published_exams WHERE id = exam_id AND teacher_id = auth.uid())
  );

-- Update handle_new_user_role to check metadata for role
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'teacher'));
  RETURN NEW;
END;
$function$;

-- Update handle_new_user to also store school
CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, school)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'school', '')
  );
  RETURN NEW;
END;
$function$;
