  created_at   timestamptz DEFAULT now(),
  UNIQUE (user_email, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lms_progress_user   ON lms_progress (user_email);
CREATE INDEX IF NOT EXISTS idx_lms_progress_lesson ON lms_progress (lesson_id);

CREATE TABLE IF NOT EXISTS lms_quizzes (
  id            text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id    text REFERENCES ecom_products (id) ON DELETE CASCADE,
  module_id     text NOT NULL REFERENCES lms_modules (id) ON DELETE CASCADE,
  title         text NOT NULL,
  passing_score integer NOT NULL DEFAULT 70,
  max_attempts  integer,  -- NULL = illimité
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lms_quizzes_module  ON lms_quizzes (module_id);
CREATE INDEX IF NOT EXISTS idx_lms_quizzes_product ON lms_quizzes (product_id);

CREATE TABLE IF NOT EXISTS lms_quiz_questions (
  id             text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  quiz_id        text NOT NULL REFERENCES lms_quizzes (id) ON DELETE CASCADE,
  question       text NOT NULL,
  options        jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer integer NOT NULL DEFAULT 0,
  position       integer NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);
