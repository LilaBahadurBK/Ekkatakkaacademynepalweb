-- ============================================================
-- EKKATAKKA ACADEMY — Complete Database Schema
-- Nepal Home Tuition Platform
-- Database: PostgreSQL (recommended) or MySQL
-- ============================================================

-- ── PROVINCES ─────────────────────────────────────────────
CREATE TABLE provinces (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  name_np       VARCHAR(100),                  -- Nepali name
  capital       VARCHAR(100),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── DISTRICTS (77 total) ───────────────────────────────────
CREATE TABLE districts (
  id            SERIAL PRIMARY KEY,
  province_id   INT NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,
  name_np       VARCHAR(100),
  created_at    TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_districts_province ON districts(province_id);

-- ── LOCAL LEVELS (753 total: Metro/Sub-metro/Municipality/Rural Municipality) ──
CREATE TABLE local_levels (
  id            SERIAL PRIMARY KEY,
  district_id   INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  name          VARCHAR(150) NOT NULL,
  name_np       VARCHAR(150),
  type          VARCHAR(50) CHECK(type IN (
                  'Metropolitan','Sub-Metropolitan',
                  'Municipality','Rural Municipality')),
  total_wards   SMALLINT NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_local_levels_district ON local_levels(district_id);

-- ── WARDS ─────────────────────────────────────────────────
-- Wards are generated dynamically (1..N) but stored for indexing
CREATE TABLE wards (
  id             SERIAL PRIMARY KEY,
  local_level_id INT NOT NULL REFERENCES local_levels(id) ON DELETE CASCADE,
  ward_number    SMALLINT NOT NULL,
  UNIQUE(local_level_id, ward_number)
);
CREATE INDEX idx_wards_local_level ON wards(local_level_id);

-- ── USERS (shared auth table) ──────────────────────────────
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(150) NOT NULL,
  phone          VARCHAR(20) UNIQUE NOT NULL,
  email          VARCHAR(200) UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  role           VARCHAR(20) CHECK(role IN ('student','teacher','admin')) NOT NULL,
  otp_verified   BOOLEAN DEFAULT FALSE,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role  ON users(role);

-- ── TEACHER PROFILES ───────────────────────────────────────
CREATE TABLE teachers (
  id               SERIAL PRIMARY KEY,
  user_id          INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  initials         VARCHAR(5),
  photo_url        VARCHAR(300),
  qualification    VARCHAR(300) NOT NULL,
  experience_years SMALLINT DEFAULT 0,
  gender           VARCHAR(20) CHECK(gender IN ('Male','Female','Other')),
  bio              TEXT,
  -- Location (primary)
  province_id      INT REFERENCES provinces(id),
  district_id      INT REFERENCES districts(id),
  local_level_id   INT REFERENCES local_levels(id),
  ward_id          INT REFERENCES wards(id),
  address_detail   VARCHAR(300),
  -- Teaching config
  teaching_mode    VARCHAR(20)[] DEFAULT ARRAY['Home Tuition'],
  travel_radius_km SMALLINT DEFAULT 5,
  -- Pricing
  price_monthly    INT NOT NULL DEFAULT 0,
  price_hourly     INT,
  -- Status
  is_verified      BOOLEAN DEFAULT FALSE,
  badge            VARCHAR(50),
  is_online        BOOLEAN DEFAULT FALSE,
  demo_available   BOOLEAN DEFAULT TRUE,
  -- Stats (denormalized for speed)
  rating           NUMERIC(3,2) DEFAULT 0,
  total_reviews    INT DEFAULT 0,
  -- Timestamps
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_teachers_province   ON teachers(province_id);
CREATE INDEX idx_teachers_district   ON teachers(district_id);
CREATE INDEX idx_teachers_locallevel ON teachers(local_level_id);
CREATE INDEX idx_teachers_ward       ON teachers(ward_id);
CREATE INDEX idx_teachers_rating     ON teachers(rating DESC);
CREATE INDEX idx_teachers_price      ON teachers(price_monthly);
CREATE INDEX idx_teachers_verified   ON teachers(is_verified);
CREATE INDEX idx_teachers_mode       ON teachers USING GIN(teaching_mode);

-- ── TEACHER SERVICE AREAS (multi-ward support) ────────────
CREATE TABLE teacher_service_areas (
  id             SERIAL PRIMARY KEY,
  teacher_id     INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  province_id    INT REFERENCES provinces(id),
  district_id    INT REFERENCES districts(id),
  local_level_id INT REFERENCES local_levels(id),
  ward_id        INT REFERENCES wards(id)
);
CREATE INDEX idx_service_areas_teacher   ON teacher_service_areas(teacher_id);
CREATE INDEX idx_service_areas_district  ON teacher_service_areas(district_id);
CREATE INDEX idx_service_areas_ward      ON teacher_service_areas(ward_id);

-- ── SUBJECTS ──────────────────────────────────────────────
CREATE TABLE subjects (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(80)  -- e.g. 'Science', 'Commerce', 'Language'
);

-- ── TEACHER SUBJECTS ──────────────────────────────────────
CREATE TABLE teacher_subjects (
  id         SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, subject_id)
);
CREATE INDEX idx_teacher_subjects_teacher ON teacher_subjects(teacher_id);
CREATE INDEX idx_teacher_subjects_subject ON teacher_subjects(subject_id);

-- ── GRADE LEVELS ──────────────────────────────────────────
CREATE TABLE grade_levels (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) UNIQUE NOT NULL,   -- 'Grade 9-SEE', '+2 Science', etc.
  sort_order SMALLINT DEFAULT 0
);

-- ── TEACHER GRADES ────────────────────────────────────────
CREATE TABLE teacher_grades (
  id           SERIAL PRIMARY KEY,
  teacher_id   INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  grade_id     INT NOT NULL REFERENCES grade_levels(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, grade_id)
);

-- ── TEACHER AVAILABILITY ──────────────────────────────────
CREATE TABLE teacher_availability (
  id         SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week VARCHAR(10) CHECK(day_of_week IN (
               'Sun','Mon','Tue','Wed','Thu','Fri','Sat')) NOT NULL,
  time_start  TIME NOT NULL,
  time_end    TIME NOT NULL,
  UNIQUE(teacher_id, day_of_week, time_start)
);
CREATE INDEX idx_availability_teacher ON teacher_availability(teacher_id);

-- ── TEACHER LANGUAGES ─────────────────────────────────────
CREATE TABLE teacher_languages (
  id         SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  language   VARCHAR(60) NOT NULL,
  UNIQUE(teacher_id, language)
);

-- ── TEACHER DOCUMENTS ─────────────────────────────────────
CREATE TABLE teacher_documents (
  id            SERIAL PRIMARY KEY,
  teacher_id    INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  doc_type      VARCHAR(80)  NOT NULL,   -- 'Citizenship','Degree','Experience Letter'
  file_url      VARCHAR(300) NOT NULL,
  status        VARCHAR(20) CHECK(status IN ('pending','approved','rejected')) DEFAULT 'pending',
  reviewed_by   INT REFERENCES users(id),
  reviewed_at   TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── STUDENT PROFILES ──────────────────────────────────────
CREATE TABLE students (
  id             SERIAL PRIMARY KEY,
  user_id        INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo_url      VARCHAR(300),
  grade_level    VARCHAR(80),
  province_id    INT REFERENCES provinces(id),
  district_id    INT REFERENCES districts(id),
  local_level_id INT REFERENCES local_levels(id),
  ward_id        INT REFERENCES wards(id),
  address_detail VARCHAR(300),
  created_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_students_district    ON students(district_id);
CREATE INDEX idx_students_local_level ON students(local_level_id);

-- ── BOOKINGS ──────────────────────────────────────────────
CREATE TABLE bookings (
  id             SERIAL PRIMARY KEY,
  student_id     INT NOT NULL REFERENCES students(id),
  teacher_id     INT NOT NULL REFERENCES teachers(id),
  subject_id     INT REFERENCES subjects(id),
  grade_id       INT REFERENCES grade_levels(id),
  teaching_mode  VARCHAR(20) CHECK(teaching_mode IN ('Home Tuition','Online')) NOT NULL,
  -- Location for home tuition
  location_province_id    INT REFERENCES provinces(id),
  location_district_id    INT REFERENCES districts(id),
  location_local_level_id INT REFERENCES local_levels(id),
  location_ward_id        INT REFERENCES wards(id),
  location_address        VARCHAR(300),
  -- Schedule
  start_date     DATE,
  end_date       DATE,
  sessions_per_week SMALLINT DEFAULT 3,
  session_duration_min SMALLINT DEFAULT 90,
  -- Pricing (snapshot at time of booking)
  price_monthly  INT NOT NULL,
  -- Status
  status         VARCHAR(30) CHECK(status IN (
                   'pending','confirmed','ongoing',
                   'completed','cancelled','rejected')) DEFAULT 'pending',
  demo_requested BOOLEAN DEFAULT FALSE,
  notes          TEXT,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_teacher ON bookings(teacher_id);
CREATE INDEX idx_bookings_status  ON bookings(status);

-- ── REVIEWS ───────────────────────────────────────────────
CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  booking_id  INT UNIQUE NOT NULL REFERENCES bookings(id),
  student_id  INT NOT NULL REFERENCES students(id),
  teacher_id  INT NOT NULL REFERENCES teachers(id),
  rating      SMALLINT CHECK(rating BETWEEN 1 AND 5) NOT NULL,
  comment     TEXT,
  is_visible  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_reviews_teacher ON reviews(teacher_id);

-- ── PAYMENTS ──────────────────────────────────────────────
CREATE TABLE payments (
  id             SERIAL PRIMARY KEY,
  booking_id     INT NOT NULL REFERENCES bookings(id),
  student_id     INT NOT NULL REFERENCES students(id),
  teacher_id     INT NOT NULL REFERENCES teachers(id),
  amount         INT NOT NULL,              -- in NPR paisa or full NPR
  currency       VARCHAR(10) DEFAULT 'NPR',
  method         VARCHAR(30) CHECK(method IN (
                   'eSewa','Khalti','Cash',
                   'Bank Transfer','IME Pay')),
  transaction_id VARCHAR(200),
  status         VARCHAR(20) CHECK(status IN (
                   'pending','completed','failed','refunded')) DEFAULT 'pending',
  paid_at        TIMESTAMP,
  created_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_teacher ON payments(teacher_id);
CREATE INDEX idx_payments_status  ON payments(status);

-- ── MESSAGES / CHAT ───────────────────────────────────────
CREATE TABLE messages (
  id          SERIAL PRIMARY KEY,
  booking_id  INT REFERENCES bookings(id),
  sender_id   INT NOT NULL REFERENCES users(id),
  receiver_id INT NOT NULL REFERENCES users(id),
  content     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_messages_sender   ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_booking  ON messages(booking_id);

-- ── SAVED TEACHERS (wishlists) ────────────────────────────
CREATE TABLE saved_teachers (
  id         SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, teacher_id)
);

-- ── NOTIFICATIONS ─────────────────────────────────────────
CREATE TABLE notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(60),   -- 'booking_request','booking_confirmed','payment_received'
  title      VARCHAR(200),
  body       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  data       JSONB,         -- extra metadata
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notifications_user   ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- ── OTP TABLE (phone login) ────────────────────────────────
CREATE TABLE otps (
  id         SERIAL PRIMARY KEY,
  phone      VARCHAR(20) NOT NULL,
  code       VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_otps_phone ON otps(phone);

-- ── ADMIN LOGS ────────────────────────────────────────────
CREATE TABLE admin_logs (
  id         SERIAL PRIMARY KEY,
  admin_id   INT NOT NULL REFERENCES users(id),
  action     VARCHAR(200) NOT NULL,
  target     VARCHAR(100),   -- e.g. 'teacher:5', 'booking:12'
  details    JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── FULL-TEXT SEARCH INDEX ────────────────────────────────
-- For fast teacher search by name/subject/location
CREATE INDEX idx_teachers_fts ON teachers USING GIN(
  to_tsvector('english', COALESCE(bio,'') || ' ' || COALESCE(qualification,''))
);

-- ── TRIGGER: auto-update teachers.rating ──────────────────
CREATE OR REPLACE FUNCTION update_teacher_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE teachers
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM reviews WHERE teacher_id = NEW.teacher_id AND is_visible = TRUE
  ),
  total_reviews = (
    SELECT COUNT(*) FROM reviews
    WHERE teacher_id = NEW.teacher_id AND is_visible = TRUE
  ),
  updated_at = NOW()
  WHERE id = NEW.teacher_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_teacher_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_teacher_rating();

-- ── TRIGGER: auto updated_at ──────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_teachers_updated_at
BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── SEED: SUBJECTS ────────────────────────────────────────
INSERT INTO subjects(name, category) VALUES
('Mathematics','Science'),('Physics','Science'),('Chemistry','Science'),
('Biology','Science'),('Computer Science','Technology'),
('Programming','Technology'),('IT','Technology'),('Web Development','Technology'),
('English','Language'),('Spoken English','Language'),('Grammar','Language'),
('Nepali','Language'),('Hindi','Language'),
('Social Studies','Humanities'),('Moral Education','Humanities'),
('Accountancy','Commerce'),('Business Studies','Commerce'),('Economics','Commerce'),
('Statistics','Commerce'),('Music','Creative'),('Fine Arts','Creative'),
('Engineering Drawing','Engineering'),('Health Science','Health');

-- ── SEED: GRADE LEVELS ────────────────────────────────────
INSERT INTO grade_levels(name, sort_order) VALUES
('Nursery-Grade 5',1),('Grade 6-8',2),('Grade 9-SEE',3),
('+2 Science',4),('+2 Management',5),('+2 Humanities',6),
('University (BCA/BIT)',7),('University (BBA/BBS)',8),
('University (Engineering)',9);
