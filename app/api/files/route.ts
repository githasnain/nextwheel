import { NextRequest, NextResponse } from 'next/server'
import { getNeonClient } from '@/lib/db'

// GET - Get all files
export async function GET() {
  try {
    const sql = getNeonClient()
    
    const filesResult = await sql`
      SELECT 
        id,
        filename,
        picture,
        active,
        ticket_number,
        created_at,
        updated_at
      FROM files
      ORDER BY created_at DESC
    `

    const files = Array.isArray(filesResult) ? filesResult : []

    return NextResponse.json({ files }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Upload a new file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, filename, json_content, picture, active, ticket_number } = body

    if (!filename || !json_content) {
      return NextResponse.json(
        { error: 'Filename and json_content are required' },
        { status: 400 }
      )
    }

    const sql = getNeonClient()
    const fileId = id || `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Insert file
    await sql`
      INSERT INTO files (id, filename, json_content, picture, active, ticket_number)
      VALUES (${fileId}, ${filename}, ${JSON.stringify(json_content)}, ${picture || null}, ${active !== false}, ${ticket_number || null})
      ON CONFLICT (id) DO UPDATE SET
        filename = EXCLUDED.filename,
        json_content = EXCLUDED.json_content,
        picture = EXCLUDED.picture,
        active = EXCLUDED.active,
        ticket_number = EXCLUDED.ticket_number,
        updated_at = NOW()
    `

    // Extract and insert entries
    if (Array.isArray(json_content) && json_content.length > 0) {
      const entries = json_content.map((item: any, idx: number) => {
        const firstName = item['First Name'] || item['first name'] || item['firstName'] || ''
        const lastName = item['Last Name'] || item['last name'] || item['lastName'] || ''
        const ticketNumber = item['Ticket Number'] || item['ticket number'] || item['ticketNumber'] || ''
        const email = item['Email'] || item['email'] || ''
        
        let name = ''
        if (firstName && lastName) {
          name = `${firstName} ${lastName}`.trim()
        } else if (firstName) {
          name = String(firstName).trim()
        } else if (lastName) {
          name = String(lastName).trim()
        } else if (ticketNumber) {
          name = String(ticketNumber).trim()
        } else {
          const keys = Object.keys(item)
          if (keys.length > 0) {
            name = String(item[keys[0]]).trim()
          }
        }

        return {
          id: `${fileId}-${idx}`,
          file_id: fileId,
          name: name || `Entry ${idx + 1}`,
          ticket_number: ticketNumber || '',
          email: email || '',
          original_data: item
        }
      })

      // Delete old entries for this file
      await sql`DELETE FROM entries WHERE file_id = ${fileId}`

      // Insert new entries in batches
      for (const entry of entries) {
        await sql`
          INSERT INTO entries (id, file_id, name, ticket_number, email, original_data)
          VALUES (${entry.id}, ${entry.file_id}, ${entry.name}, ${entry.ticket_number || null}, ${entry.email || null}, ${JSON.stringify(entry.original_data)})
        `
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        file: {
          id: fileId,
          filename,
          active: active !== false
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    )
  }
}

