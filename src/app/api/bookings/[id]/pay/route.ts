import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Payment request for booking ID:', params.id)
    
    const body = await request.json()
    const { paymentMethod } = body

    // Find booking by MongoDB ObjectId
    const booking = await db.booking.findUnique({
      where: { id: params.id }
    })

    if (!booking) {
      console.log('Booking not found with ID:', params.id)
      return NextResponse.json({ 
        error: 'Booking not found',
        details: 'Invalid booking ID'
      }, { status: 404 })
    }

    // Update booking with payment info
    const updatedBooking = await db.booking.update({
      where: { id: params.id },
      data: {
        paymentMethod: paymentMethod || 'GOOGLE_PAY',
        paymentStatus: 'COMPLETED',
        status: 'CONFIRMED'
      }
    })

    console.log('Payment completed for booking:', updatedBooking.bookingId)

    return NextResponse.json({ 
      success: true,
      booking: {
        id: updatedBooking.id,
        bookingId: updatedBooking.bookingId
      }
    })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json({ 
      error: 'Payment processing failed',
      details: error.message 
    }, { status: 500 })
  }
}
