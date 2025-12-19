import { NextRequest, NextResponse } from 'next/server'
import { getNeonClient } from '@/lib/db'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Get all winners
export async function GET() {
  try {
    const sql = getNeonClient()
    
    const winnersResult = await sql`
      SELECT * FROM winners
      ORDER BY spin_number ASC, created_at DESC
    `

    const winners = Array.isArray(winnersResult) ? winnersResult : []

    return NextResponse.json({ winners }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching winners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch winners', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Add a winner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entry_id, name, ticket_number, spin_number, color } = body

    if (!name || spin_number === undefined) {
      return NextResponse.json(
        { error: 'Name and spin_number are required' },
        { status: 400 }
      )
    }

    const sql = getNeonClient()
    const winnerId = `winner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO winners (id, entry_id, name, ticket_number, spin_number, color)
      VALUES (${winnerId}, ${entry_id || null}, ${name}, ${ticket_number || null}, ${spin_number}, ${color || null})
    `

    return NextResponse.json(
      { success: true, winner: { id: winnerId, name, spin_number } },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error adding winner:', error)
    return NextResponse.json(
      { error: 'Failed to add winner', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove a winner (adds to removed_entries)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, ticket_number } = body

    if (!ticket_number) {
      return NextResponse.json(
        { error: 'Ticket number is required to remove winner' },
        { status: 400 }
      )
    }

    const sql = getNeonClient()
    const removedId = `removed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Add to removed_entries
    await sql`
      INSERT INTO removed_entries (id, name, ticket_number)
      VALUES (${removedId}, ${name || ''}, ${ticket_number})
      ON CONFLICT (name, ticket_number) DO NOTHING
    `

    // Delete from winners
    await sql`
      DELETE FROM winners 
      WHERE ticket_number = ${ticket_number}
    `

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error removing winner:', error)
    return NextResponse.json(
      { error: 'Failed to remove winner', details: error.message },
      { status: 500 }
    )
  }
}

