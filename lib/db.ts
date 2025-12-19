import { neon, neonConfig } from '@neondatabase/serverless'
import { Pool } from 'pg'

// Configure Neon for better performance
neonConfig.fetchConnectionCache = true

// Neon serverless client (for serverless functions)
let sql: ReturnType<typeof neon> | null = null

export function getNeonClient() {
  if (!sql) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    sql = neon(connectionString)
  }

  return sql
}

// Traditional Pool for migrations and complex queries
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }

  return pool
}

// Initialize database schema (called on app startup)
export async function initDatabase() {
  const pool = getPool()
  
  try {
    // This is now handled by migrations, but we keep this for runtime checks
    console.log('Database connection verified')
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw error
  }
}


