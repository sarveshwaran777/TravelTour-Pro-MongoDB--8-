import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const totalUsers = await db.user.count({ where: { role: 'USER' } })
    const totalBookings = await db.booking.count()
    const confirmedBookings = await db.booking.count({ where: { status: 'CONFIRMED' } })
    const revenueResult = await db.booking.aggregate({
      where: { paymentStatus: 'COMPLETED' },
      _sum: { totalCost: true }
    })
    
    const recentBookings = await db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { destination: true }
    })

    return NextResponse.json({
      totalUsers,
      totalBookings,
      confirmedBookings,
      totalRevenue: revenueResult._sum.totalCost || 0,
      recentBookings
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
