import { NextRequest, NextResponse } from 'next/server'
import { getNeonClient } from '@/lib/db'

// POST - Check password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const sql = getNeonClient()

    // Default password is "admin"
    if (password === 'admin') {
      return NextResponse.json({ valid: true }, { status: 200 })
    }

    // Check against stored hash
    const [result] = await sql`
      SELECT password_hash FROM admin_password WHERE id = 'admin'
    `

    if (result) {
      const inputHash = btoa(password).substring(0, 10)
      const valid = inputHash === result.password_hash
      return NextResponse.json({ valid }, { status: 200 })
    }

    // If no stored password, only "admin" is valid
    return NextResponse.json({ valid: false }, { status: 200 })
  } catch (error: any) {
    console.error('Error checking password:', error)
    return NextResponse.json(
      { error: 'Failed to check password', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Update password
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { oldPassword, newPassword } = body

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Old password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { error: 'New password must be at least 4 characters long' },
        { status: 400 }
      )
    }

    const sql = getNeonClient()

    // Verify old password
    if (oldPassword !== 'admin') {
      const [result] = await sql`
        SELECT password_hash FROM admin_password WHERE id = 'admin'
      `
      
      if (!result) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        )
      }

      const inputHash = btoa(oldPassword).substring(0, 10)
      if (inputHash !== result.password_hash) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        )
      }
    }

    // Update password
    const newHash = btoa(newPassword).substring(0, 10)
    await sql`
      INSERT INTO admin_password (id, password_hash, updated_at)
      VALUES ('admin', ${newHash}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
    `

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Failed to update password', details: error.message },
      { status: 500 }
    )
  }
}

