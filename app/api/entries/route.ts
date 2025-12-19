import { NextRequest, NextResponse } from 'next/server'
import { getNeonClient } from '@/lib/db'

// GET - Get all entries (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const sql = getNeonClient()
    const searchParams = request.nextUrl.searchParams
    const fileId = searchParams.get('fileId')
    const search = searchParams.get('search')

    let entriesResult: any
    
    if (fileId) {
      entriesResult = await sql`
        SELECT 
          e.*,
          f.filename as file_name,
          f.active as file_active
        FROM entries e
        LEFT JOIN files f ON e.file_id = f.id
        WHERE e.file_id = ${fileId}
      `
    } else {
      entriesResult = await sql`
        SELECT 
          e.*,
          f.filename as file_name,
          f.active as file_active
        FROM entries e
        LEFT JOIN files f ON e.file_id = f.id
      `
    }
    
    // Ensure entries is an array
    const entries: any[] = Array.isArray(entriesResult) ? entriesResult : []

    // Filter out removed entries
    const removedEntriesResult = await sql`
      SELECT name, ticket_number FROM removed_entries
    `
    
    const removedEntries = Array.isArray(removedEntriesResult) ? removedEntriesResult : []
    const removedMap = new Map()
    removedEntries.forEach((r: any) => {
      const key = `${r.name?.toLowerCase()}_${r.ticket_number?.toLowerCase()}`
      removedMap.set(key, true)
    })

    entries = entries.filter((entry: any) => {
      const key = `${entry.name?.toLowerCase()}_${entry.ticket_number?.toLowerCase()}`
      return !removedMap.has(key)
    })

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      entries = entries.filter((entry: any) => {
        return (
          entry.name?.toLowerCase().includes(searchLower) ||
          entry.ticket_number?.toLowerCase().includes(searchLower) ||
          entry.email?.toLowerCase().includes(searchLower)
        )
      })
    }

    return NextResponse.json({ entries }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries', details: error.message },
      { status: 500 }
    )
  }
}

