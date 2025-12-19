import { NextRequest, NextResponse } from 'next/server'
import { getNeonClient } from '@/lib/db'

// GET - Get selected winners (for fixed spins)
export async function GET() {
  try {
    const sql = getNeonClient()
    
    const selectedWinnersResult = await sql`
      SELECT * FROM selected_winners
      ORDER BY spin_number ASC
    `

    const selectedWinners = Array.isArray(selectedWinnersResult) ? selectedWinnersResult : []

    return NextResponse.json({ selectedWinners }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching selected winners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch selected winners', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Set selected winner for a spin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { spin_number, entry_id, name, ticket_number } = body

    if (spin_number === undefined || !name) {
      return NextResponse.json(
        { error: 'spin_number and name are required' },
        { status: 400 }
      )
    }

    const sql = getNeonClient()
    const id = `selected-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO selected_winners (id, spin_number, entry_id, name, ticket_number)
      VALUES (${id}, ${spin_number}, ${entry_id || null}, ${name}, ${ticket_number || null})
      ON CONFLICT (spin_number) DO UPDATE SET
        entry_id = EXCLUDED.entry_id,
        name = EXCLUDED.name,
        ticket_number = EXCLUDED.ticket_number
    `

    return NextResponse.json(
      { success: true, selectedWinner: { id, spin_number, name } },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error setting selected winner:', error)
    return NextResponse.json(
      { error: 'Failed to set selected winner', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove selected winner for a spin
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { spin_number } = body

    if (spin_number === undefined) {
      return NextResponse.json(
        { error: 'spin_number is required' },
        { status: 400 }
      )
    }

    const sql = getNeonClient()
    await sql`DELETE FROM selected_winners WHERE spin_number = ${spin_number}`

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error removing selected winner:', error)
    return NextResponse.json(
      { error: 'Failed to remove selected winner', details: error.message },
      { status: 500 }
    )
  }
}

