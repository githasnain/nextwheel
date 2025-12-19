import { NextRequest, NextResponse } from 'next/server'
import { getNeonClient } from '@/lib/db'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Get all settings
export async function GET() {
  try {
    const sql = getNeonClient()
    
    const settingsResult = await sql`
      SELECT key, value FROM settings
    `

    const settings = Array.isArray(settingsResult) ? settingsResult : []
    const settingsObj: Record<string, any> = {}
    settings.forEach((s: any) => {
      settingsObj[s.key] = s.value
    })

    return NextResponse.json({ settings: settingsObj }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      )
    }

    const sql = getNeonClient()

    await sql`
      INSERT INTO settings (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}, NOW())
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = NOW()
    `

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    )
  }
}

