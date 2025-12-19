-- Initial database schema for Wheel of Names

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  json_content JSONB NOT NULL,
  picture TEXT,
  active BOOLEAN DEFAULT true,
  ticket_number TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create entries table (normalized from files)
CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  file_id TEXT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ticket_number TEXT,
  email TEXT,
  original_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create winners table
CREATE TABLE IF NOT EXISTS winners (
  id TEXT PRIMARY KEY,
  entry_id TEXT,
  name TEXT NOT NULL,
  ticket_number TEXT,
  spin_number INTEGER NOT NULL,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create removed_entries table (for tracking removed entries)
CREATE TABLE IF NOT EXISTS removed_entries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ticket_number TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, ticket_number)
);

-- Create selected_winners table (for fixed spins)
CREATE TABLE IF NOT EXISTS selected_winners (
  id TEXT PRIMARY KEY,
  spin_number INTEGER NOT NULL,
  entry_id TEXT,
  name TEXT NOT NULL,
  ticket_number TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(spin_number)
);

-- Create admin_password table
CREATE TABLE IF NOT EXISTS admin_password (
  id TEXT PRIMARY KEY DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin password if not exists
INSERT INTO admin_password (id, password_hash)
VALUES ('admin', 'YWRtaW4=')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_entries_file_id ON entries(file_id);
CREATE INDEX IF NOT EXISTS idx_entries_ticket_number ON entries(ticket_number);
CREATE INDEX IF NOT EXISTS idx_winners_spin_number ON winners(spin_number);
CREATE INDEX IF NOT EXISTS idx_removed_entries_ticket ON removed_entries(ticket_number);
CREATE INDEX IF NOT EXISTS idx_selected_winners_spin ON selected_winners(spin_number);

