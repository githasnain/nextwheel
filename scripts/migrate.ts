import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

import { getPool } from '../lib/db'

async function migrate() {
  const pool = getPool()
  
  try {
    console.log('Starting database migration...')

    // Create files table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        json_content JSONB NOT NULL,
        picture TEXT,
        active BOOLEAN DEFAULT true,
        ticket_number TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✓ Created files table')

    // Create entries table (normalized from files)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS entries (
        id TEXT PRIMARY KEY,
        file_id TEXT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        ticket_number TEXT,
        email TEXT,
        original_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✓ Created entries table')

    // Create winners table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS winners (
        id TEXT PRIMARY KEY,
        entry_id TEXT,
        name TEXT NOT NULL,
        ticket_number TEXT,
        spin_number INTEGER NOT NULL,
        color TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✓ Created winners table')

    // Create settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✓ Created settings table')

    // Create removed_entries table (for tracking removed entries)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS removed_entries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ticket_number TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(name, ticket_number)
      )
    `)
    console.log('✓ Created removed_entries table')

    // Create selected_winners table (for fixed spins)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS selected_winners (
        id TEXT PRIMARY KEY,
        spin_number INTEGER NOT NULL,
        entry_id TEXT,
        name TEXT NOT NULL,
        ticket_number TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(spin_number)
      )
    `)
    console.log('✓ Created selected_winners table')

    // Create admin_password table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_password (
        id TEXT PRIMARY KEY DEFAULT 'admin',
        password_hash TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✓ Created admin_password table')

    // Insert default admin password if not exists
    await pool.query(`
      INSERT INTO admin_password (id, password_hash)
      VALUES ('admin', 'YWRtaW4=')
      ON CONFLICT (id) DO NOTHING
    `)
    console.log('✓ Set default admin password')

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_entries_file_id ON entries(file_id)
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_entries_ticket_number ON entries(ticket_number)
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_winners_spin_number ON winners(spin_number)
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_removed_entries_ticket ON removed_entries(ticket_number)
    `)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_selected_winners_spin ON selected_winners(spin_number)
    `)
    console.log('✓ Created indexes')

    console.log('✅ Database migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
}

migrate()

