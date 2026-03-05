'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plane,
  Users,
  Calendar,
  IndianRupee,
  LogOut,
  Shield,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalBookings: number
  confirmedBookings: number
  totalRevenue: number
  recentBookings: any[]
}

// Helper to get admin from localStorage
function getAdminFromStorage() {
  if (typeof window === 'undefined') return null
  const adminData = localStorage.getItem('admin')
  return adminData ? JSON.parse(adminData) : null
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(() => getAdminFromStorage())
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    recentBookings: []
  })

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login')
      return
    }
    
    let isMounted = true
    
    async function loadStats() {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok && isMounted) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats')
      }
    }
    
    loadStats()
    
    return () => {
      isMounted = false
    }
  }, [admin, router])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-md border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              TravelTour Pro - Admin
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-blue-400 font-medium">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-white/70 hover:text-white">
              Users
            </Link>
            <Link href="/admin/bookings" className="text-white/70 hover:text-white">
              Bookings
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <span className="text-white/70">Welcome, {admin.name || 'Admin'}</span>
            <Button variant="ghost" onClick={handleLogout} className="text-white/70 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-white/60">Monitor your travel business performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Confirmed Trips</p>
                  <p className="text-3xl font-bold text-white">{stats.confirmedBookings}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/users">
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Manage Users</h3>
                    <p className="text-white/60">View all registered users</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/bookings">
            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Manage Bookings</h3>
                    <p className="text-white/60">View all trip bookings</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Bookings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto text-white/20 mb-4" />
                <p className="text-white/60">No recent bookings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img 
                        src={booking.destination?.image || '/placeholder.jpg'} 
                        alt={booking.destination?.name || 'Destination'}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-white">{booking.guestName}</p>
                        <p className="text-sm text-white/60">{booking.destination?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">₹{booking.totalCost?.toLocaleString()}</p>
                      <Badge className={booking.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
