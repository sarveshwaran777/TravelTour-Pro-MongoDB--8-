'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plane,
  Calendar,
  Search,
  LogOut,
  Shield,
  Users,
  IndianRupee,
  ArrowLeft
} from 'lucide-react'

interface Booking {
  id: string
  bookingId: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  travelDate: string
  numberOfPersons: number
  totalCost: number
  status: string
  transport: string
  foodPreference: string
  paymentMethod: string
  createdAt: string
  destination?: {
    name: string
    image: string
  }
}

function getAdminFromStorage() {
  if (typeof window === 'undefined') return null
  const adminData = localStorage.getItem('admin')
  return adminData ? JSON.parse(adminData) : null
}

export default function AdminBookingsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(() => getAdminFromStorage())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login')
      return
    }
    
    let isMounted = true
    
    async function loadBookings() {
      try {
        const response = await fetch('/api/admin/bookings')
        if (response.ok && isMounted) {
          const data = await response.json()
          setBookings(data.bookings)
        }
      } catch (error) {
        console.error('Failed to fetch bookings')
      }
    }
    
    loadBookings()
    
    return () => {
      isMounted = false
    }
  }, [admin, router])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.destination?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
            <span className="text-xl font-bold text-white">TravelTour Pro - Admin</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
            <Link href="/admin/users" className="text-white/70 hover:text-white">Users</Link>
            <Link href="/admin/bookings" className="text-blue-400 font-medium">Bookings</Link>
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
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">All Bookings</h1>
          <p className="text-white/60">View and manage all trip bookings</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search by name, booking ID, or destination..."
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-white/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                className={statusFilter === status ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-700 text-white/70'}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Bookings ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-white/20 mb-4" />
                <p className="text-white/60">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-white/60 font-medium">Booking ID</th>
                      <th className="text-left p-4 text-white/60 font-medium">Guest</th>
                      <th className="text-left p-4 text-white/60 font-medium">Destination</th>
                      <th className="text-left p-4 text-white/60 font-medium">Travel Date</th>
                      <th className="text-left p-4 text-white/60 font-medium">Persons</th>
                      <th className="text-left p-4 text-white/60 font-medium">Amount</th>
                      <th className="text-left p-4 text-white/60 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4">
                          <span className="font-mono text-white text-sm">{booking.bookingId}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{booking.guestName}</p>
                            <p className="text-white/60 text-sm">{booking.guestEmail}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {booking.destination?.image && (
                              <img 
                                src={booking.destination.image} 
                                alt={booking.destination.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <span className="text-white/80">{booking.destination?.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/80">
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-white/80">{booking.numberOfPersons}</td>
                        <td className="p-4">
                          <span className="text-green-400 font-medium">₹{booking.totalCost?.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <Badge className={
                            booking.status === 'CONFIRMED' ? 'bg-green-500' :
                            booking.status === 'PENDING' ? 'bg-yellow-500' :
                            booking.status === 'COMPLETED' ? 'bg-blue-500' :
                            'bg-red-500'
                          }>
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
