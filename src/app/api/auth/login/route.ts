import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Login request:', { email })

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if database is accessible
    let user
    try {
      user = await db.user.findUnique({ where: { email } })
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed. Please run: bunx prisma db push',
        details: dbError.message 
      }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('Login successful:', user.email)

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, age: user.age }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
