import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Fetching booking with ID:', params.id)
    
    const booking = await db.booking.findUnique({
      where: { id: params.id },
      include: { destination: true }
    })
    
    if (!booking) {
      console.log('Booking not found:', params.id)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    console.log('Booking found:', booking.bookingId)
    return NextResponse.json({ booking })
  } catch (error: any) {
    console.error('Get booking error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
