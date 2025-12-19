import { NextRequest, NextResponse } from 'next/server'
import { getNeonClient } from '@/lib/db'

// GET - Get a specific file with entries
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getNeonClient()
    const fileId = params.id

    const [file] = await sql`
      SELECT * FROM files WHERE id = ${fileId}
    `

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Get entries for this file
    const entries = await sql`
      SELECT * FROM entries WHERE file_id = ${fileId}
    `

    return NextResponse.json({
      ...file,
      entries
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching file:', error)
    return NextResponse.json(
      { error: 'Failed to fetch file', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete a file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getNeonClient()
    const fileId = params.id

    await sql`DELETE FROM files WHERE id = ${fileId}`

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Update file (toggle active, update fields)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getNeonClient()
    const fileId = params.id
    const body = await request.json()

    if (body.active !== undefined) {
      await sql`
        UPDATE files 
        SET active = ${body.active}, updated_at = NOW()
        WHERE id = ${fileId}
      `
    }

    if (body.ticket_number !== undefined) {
      await sql`
        UPDATE files 
        SET ticket_number = ${body.ticket_number}, updated_at = NOW()
        WHERE id = ${fileId}
      `
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating file:', error)
    return NextResponse.json(
      { error: 'Failed to update file', details: error.message },
      { status: 500 }
    )
  }
}

