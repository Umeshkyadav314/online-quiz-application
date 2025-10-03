import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'quiz.db')
const db = new Database(dbPath)

// Initialize database tables
function initDatabase() {
    // Users table with enhanced fields
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      profile_image TEXT,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

    // Sessions table
    db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users (email) ON DELETE CASCADE
    )
  `)

    // Subjects table
    db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

    // Topics table
    db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE,
      UNIQUE(subject_id, name)
    )
  `)

    // Questions table
    db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      topic_id INTEGER,
      text TEXT NOT NULL,
      options TEXT NOT NULL, -- JSON array of options
      correct_index INTEGER NOT NULL,
      difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
      explanation TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE,
      FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES users (email) ON DELETE SET NULL
    )
  `)

    // Quiz results table with detailed scoring
    db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      subject_id INTEGER,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      percentage REAL NOT NULL,
      correct_answers INTEGER NOT NULL,
      wrong_answers INTEGER NOT NULL,
      skipped_answers INTEGER NOT NULL,
      time_taken INTEGER, -- in seconds
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users (email) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE SET NULL
    )
  `)

    // Quiz result details table for individual question tracking
    db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_result_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      result_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      user_answer INTEGER,
      is_correct BOOLEAN NOT NULL,
      time_spent INTEGER, -- in seconds
      FOREIGN KEY (result_id) REFERENCES quiz_results (id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
    )
  `)

    // Insert default subjects if they don't exist
    db.exec(`
    INSERT OR IGNORE INTO subjects (id, name, description) VALUES 
    (1, 'Mathematics', 'Mathematical concepts and problem solving'),
    (2, 'Science', 'Physics, Chemistry, Biology and other sciences'),
    (3, 'History', 'Historical events, dates, and figures'),
    (4, 'General Knowledge', 'Current affairs, geography, and miscellaneous topics')
  `)

    // Insert default topics
    db.exec(`
    INSERT OR IGNORE INTO topics (subject_id, name, description) VALUES 
    (1, 'Algebra', 'Algebraic equations and expressions'),
    (1, 'Geometry', 'Shapes, angles, and spatial reasoning'),
    (1, 'Calculus', 'Derivatives, integrals, and limits'),
    (2, 'Physics', 'Laws of motion, energy, and matter'),
    (2, 'Chemistry', 'Elements, compounds, and reactions'),
    (2, 'Biology', 'Living organisms and life processes'),
    (3, 'World History', 'Major historical events and civilizations'),
    (3, 'Indian History', 'Indian historical events and culture'),
    (4, 'Current Affairs', 'Recent news and events'),
    (4, 'Geography', 'Countries, capitals, and physical features')
  `)

    console.log('Database initialized successfully')
}

// Initialize database first
initDatabase()

// User operations
export const userQueries = {
    create: db.prepare(`
    INSERT INTO users (email, password, name, role) 
    VALUES (?, ?, ?, ?)
  `),

    findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),

    updateProfile: db.prepare(`
    UPDATE users SET name = ?, profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?
  `),

    updateProfileImage: db.prepare(`
    UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?
  `),

    getAll: db.prepare(`
    SELECT id, email, name, role, profile_image, created_at FROM users ORDER BY created_at DESC
  `),

    getByRole: db.prepare(`
    SELECT id, email, name, profile_image, created_at FROM users WHERE role = ? ORDER BY created_at DESC
  `)
}

// Session operations
export const sessionQueries = {
    create: db.prepare(`
    INSERT INTO sessions (id, user_email) 
    VALUES (?, ?)
  `),

    findBySessionId: db.prepare(`
    SELECT user_email FROM sessions WHERE id = ?
  `),

    delete: db.prepare(`
    DELETE FROM sessions WHERE id = ?
  `),

    deleteByEmail: db.prepare(`
    DELETE FROM sessions WHERE user_email = ?
  `)
}

// Subject operations
export const subjectQueries = {
    getAll: db.prepare(`
    SELECT * FROM subjects ORDER BY name
  `),

    findById: db.prepare(`
    SELECT * FROM subjects WHERE id = ?
  `),

    create: db.prepare(`
    INSERT INTO subjects (name, description) VALUES (?, ?)
  `),

    update: db.prepare(`
    UPDATE subjects SET name = ?, description = ? WHERE id = ?
  `),

    delete: db.prepare(`
    DELETE FROM subjects WHERE id = ?
  `)
}

// Topic operations
export const topicQueries = {
    getBySubject: db.prepare(`
    SELECT * FROM topics WHERE subject_id = ? ORDER BY name
  `),

    findById: db.prepare(`
    SELECT * FROM topics WHERE id = ?
  `),

    create: db.prepare(`
    INSERT INTO topics (subject_id, name, description) VALUES (?, ?, ?)
  `),

    update: db.prepare(`
    UPDATE topics SET name = ?, description = ? WHERE id = ?
  `),

    delete: db.prepare(`
    DELETE FROM topics WHERE id = ?
  `)
}

// Question operations
export const questionQueries = {
    getAll: db.prepare(`
    SELECT q.*, s.name as subject_name, t.name as topic_name 
    FROM questions q 
    LEFT JOIN subjects s ON q.subject_id = s.id 
    LEFT JOIN topics t ON q.topic_id = t.id 
    ORDER BY q.created_at DESC
  `),

    getBySubject: db.prepare(`
    SELECT q.*, s.name as subject_name, t.name as topic_name 
    FROM questions q 
    LEFT JOIN subjects s ON q.subject_id = s.id 
    LEFT JOIN topics t ON q.topic_id = t.id 
    WHERE q.subject_id = ? 
    ORDER BY q.created_at DESC
  `),

    getByTopic: db.prepare(`
    SELECT q.*, s.name as subject_name, t.name as topic_name 
    FROM questions q 
    LEFT JOIN subjects s ON q.subject_id = s.id 
    LEFT JOIN topics t ON q.topic_id = t.id 
    WHERE q.topic_id = ? 
    ORDER BY q.created_at DESC
  `),

    getRandom: db.prepare(`
    SELECT q.*, s.name as subject_name, t.name as topic_name 
    FROM questions q 
    LEFT JOIN subjects s ON q.subject_id = s.id 
    LEFT JOIN topics t ON q.topic_id = t.id 
    WHERE q.subject_id = ? 
    ORDER BY RANDOM() 
    LIMIT ?
  `),

    findById: db.prepare(`
    SELECT q.*, s.name as subject_name, t.name as topic_name 
    FROM questions q 
    LEFT JOIN subjects s ON q.subject_id = s.id 
    LEFT JOIN topics t ON q.topic_id = t.id 
    WHERE q.id = ?
  `),

    create: db.prepare(`
    INSERT INTO questions (subject_id, topic_id, text, options, correct_index, difficulty, explanation, created_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

    update: db.prepare(`
    UPDATE questions SET subject_id = ?, topic_id = ?, text = ?, options = ?, correct_index = ?, 
    difficulty = ?, explanation = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),

    delete: db.prepare(`
    DELETE FROM questions WHERE id = ?
  `)
}

// Quiz results operations
export const quizQueries = {
    create: db.prepare(`
    INSERT INTO quiz_results (user_email, subject_id, score, total_questions, percentage, correct_answers, wrong_answers, skipped_answers, time_taken) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

    getByUser: db.prepare(`
    SELECT qr.*, s.name as subject_name 
    FROM quiz_results qr 
    LEFT JOIN subjects s ON qr.subject_id = s.id 
    WHERE qr.user_email = ? 
    ORDER BY qr.completed_at DESC
  `),

    getBySubject: db.prepare(`
    SELECT qr.*, s.name as subject_name, u.name as user_name 
    FROM quiz_results qr 
    LEFT JOIN subjects s ON qr.subject_id = s.id 
    LEFT JOIN users u ON qr.user_email = u.email 
    WHERE qr.subject_id = ? 
    ORDER BY qr.completed_at DESC
  `),

    getStats: db.prepare(`
    SELECT 
      COUNT(*) as total_quizzes,
      AVG(percentage) as avg_percentage,
      MAX(percentage) as best_percentage,
      MIN(percentage) as worst_percentage
    FROM quiz_results WHERE user_email = ?
  `)
}

// Quiz result details operations
export const quizDetailQueries = {
    create: db.prepare(`
    INSERT INTO quiz_result_details (result_id, question_id, user_answer, is_correct, time_spent) 
    VALUES (?, ?, ?, ?, ?)
  `),

    getByResult: db.prepare(`
    SELECT qrd.*, q.text as question_text, q.options, q.explanation 
    FROM quiz_result_details qrd 
    JOIN questions q ON qrd.question_id = q.id 
    WHERE qrd.result_id = ? 
    ORDER BY qrd.id
  `)
}

export default db
