import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, address, age } = body

    console.log('Register request:', { name, email })

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    // Check if database is accessible
    try {
      const existingUser = await db.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed. Please run: bunx prisma db push',
        details: dbError.message 
      }, { status: 500 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: { name, email, password: hashedPassword, phone, address, age: age ? parseInt(age) : null, role: 'USER' }
    })

    console.log('User created:', user.email)

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, age: user.age }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
