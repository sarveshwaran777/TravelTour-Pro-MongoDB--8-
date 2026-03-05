import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rating, destinationId, userId, comment } = body

    const review = await db.review.create({
      data: {
        userId: userId || 'guest-user',
        destinationId,
        rating,
        comment
      }
    })

    return NextResponse.json({ review })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
