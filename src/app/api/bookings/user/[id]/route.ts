import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookings = await db.booking.findMany({
      where: { userId: params.id },
      include: { destination: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
