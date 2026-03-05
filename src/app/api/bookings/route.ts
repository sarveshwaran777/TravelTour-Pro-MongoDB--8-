import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TTP${timestamp}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Booking request:', body)

    const { 
      guestName, 
      guestEmail, 
      guestPhone, 
      guestAddress, 
      guestAge, 
      travelDate, 
      numberOfPersons, 
      transport, 
      foodPreference, 
      totalCost,
      destinationId,
      userId
    } = body

    // Validate
    if (!guestEmail || !guestName || !travelDate) {
      return NextResponse.json({ 
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const bookingId = generateBookingId()

    // 1. Create/find user
    let user = await db.user.findUnique({ where: { email: guestEmail } })
    if (!user) {
      user = await db.user.create({
        data: {
          name: guestName,
          email: guestEmail,
          password: 'guest',
          role: 'USER'
        }
      })
    }

    // 2. Create state
    let state = await db.state.findFirst()
    if (!state) {
      state = await db.state.create({
        data: { name: 'Default State' }
      })
    }

    // 3. Create destination
    let dest = await db.destination.findFirst()
    if (!dest) {
      dest = await db.destination.create({
        data: {
          name: destinationId || 'Travel Destination',
          stateId: state.id
        }
      })
    }

    // 4. Create booking
    const booking = await db.booking.create({
      data: {
        bookingId: bookingId,
        userId: user.id,
        destinationId: dest.id,
        travelDate: new Date(travelDate),
        numberOfPersons: parseInt(String(numberOfPersons)) || 1,
        transport: (transport as any) || 'CAR',
        foodPreference: (foodPreference as any) || 'VEG',
        totalCost: parseFloat(String(totalCost)) || 0,
        paymentMethod: 'GOOGLE_PAY',
        paymentStatus: 'PENDING',
        status: 'PENDING',
        guestName,
        guestEmail,
        guestPhone,
        guestAddress,
        guestAge: guestAge ? parseInt(String(guestAge)) : null
      }
    })

    console.log('Created booking:', booking.bookingId)

    return NextResponse.json({ 
      success: true,
      booking: {
        id: booking.id,
        bookingId: booking.bookingId
      }
    })
  } catch (error: any) {
    console.error('Booking error:', error)
    return NextResponse.json({ 
      error: error.message || 'Booking failed'
    }, { status: 500 })
  }
}
