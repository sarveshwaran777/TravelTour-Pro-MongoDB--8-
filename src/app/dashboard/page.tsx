'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plane, 
  MapPin, 
  Star,
  Calendar,
  Users,
  Clock,
  LogOut,
  User,
  IndianRupee,
  ArrowRight,
  Timer
} from 'lucide-react'

interface Booking {
  id: string
  bookingId: string
  travelDate: string
  numberOfPersons: number
  totalCost: number
  status: string
  transport: string
  foodPreference: string
  destination: {
    name: string
    image: string
    mapEmbedUrl: string
  }
}

function getUserFromStorage() {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(() => getUserFromStorage())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    let isMounted = true
    
    async function loadBookings() {
      try {
        const response = await fetch(`/api/bookings/user/${user.id}`)
        if (response.ok && isMounted) {
          const data = await response.json()
          setBookings(data.bookings)
          if (data.bookings.length > 0) {
            setSelectedBooking(data.bookings[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch bookings')
      }
    }
    
    loadBookings()
    
    return () => {
      isMounted = false
    }
  }, [user, router])

  useEffect(() => {
    if (selectedBooking) {
      const interval = setInterval(() => {
        const travelDate = new Date(selectedBooking.travelDate)
        const now = new Date()
        const diff = travelDate.getTime() - now.getTime()
        
        if (diff > 0) {
          setCountdown({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          })
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [selectedBooking])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-orange-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              TravelTour Pro
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/states" className="text-gray-600 hover:text-orange-600">Explore</Link>
            <Link href="/dashboard" className="text-orange-600 font-medium">My Trips</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your trips and explore new destinations</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Plane className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Trips Yet</h2>
              <p className="text-gray-500 mb-6">Start exploring and book your first adventure!</p>
              <Link href="/states">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  Explore Destinations <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {selectedBooking && (
                <Card className="border-0 shadow-xl mb-6">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Current Trip</CardTitle>
                        <CardDescription className="text-white/80">{selectedBooking.destination?.name}</CardDescription>
                      </div>
                      <Badge className="bg-white/20 text-white">
                        {selectedBooking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex gap-4 mb-6">
                      <img 
                        src={selectedBooking.destination?.image} 
                        alt={selectedBooking.destination?.name}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{selectedBooking.destination?.name}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(selectedBooking.travelDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {selectedBooking.numberOfPersons} Person(s)
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            {selectedBooking.totalCost?.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {selectedBooking.transport}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Timer className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-600">Trip Starts In</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        {[
                          { value: countdown.days, label: 'Days' },
                          { value: countdown.hours, label: 'Hours' },
                          { value: countdown.minutes, label: 'Minutes' },
                          { value: countdown.seconds, label: 'Seconds' }
                        ].map((item, i) => (
                          <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-3xl font-bold text-orange-600">{item.value}</div>
                            <div className="text-sm text-gray-500">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg overflow-hidden h-[250px] bg-gray-100">
                      <iframe
                        src={selectedBooking.destination?.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className={`flex gap-4 p-4 rounded-lg cursor-pointer transition-all ${selectedBooking?.id === booking.id ? 'bg-orange-50 border-2 border-orange-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <img 
                          src={booking.destination?.image} 
                          alt={booking.destination?.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{booking.destination?.name}</h4>
                            <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'} className={booking.status === 'CONFIRMED' ? 'bg-green-500' : ''}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(booking.travelDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {booking.numberOfPersons}
                            </span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              {booking.totalCost?.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-mono">ID: {booking.bookingId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Total Trips</span>
                      <span className="font-bold text-xl">{bookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Confirmed</span>
                      <span className="font-bold text-xl text-green-600">{bookings.filter(b => b.status === 'CONFIRMED').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Total Spent</span>
                      <span className="font-bold text-xl text-orange-600">₹{bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Link href="/states">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 py-6">
                  Book Another Trip <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
