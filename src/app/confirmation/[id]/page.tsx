'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plane, 
  CheckCircle,
  Star,
  Calendar,
  Users,
  MapPin,
  Phone,
  Clock,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

export default function ConfirmationPage() {
  const params = useParams()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [showRating, setShowRating] = useState(true)

  useEffect(() => {
    fetchBooking()
  }, [params.id])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/by-booking-id/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBooking(data.booking)
      }
    } catch (error) {
      console.error('Failed to load booking')
    } finally {
      setLoading(false)
    }
  }

  const submitRating = async () => {
    if (rating > 0 && booking) {
      try {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: booking.id,
            rating,
            destinationId: booking.destinationId
          })
        })
        toast.success('Thank you for your rating!')
      } catch (error) {
        console.error('Failed to submit rating')
      }
    }
    setShowRating(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">Your booking ID: {params.id}</p>
          <p className="text-gray-600 mb-6">A travel guide will contact you soon.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/states">
              <Button variant="outline">
                Explore More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50">
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your trip is confirmed, and a travel guide will contact you soon.</p>
          </div>

          {/* Booking Details Card */}
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle>Booking Details</CardTitle>
                <Badge className="bg-white/20 text-white text-lg px-4 py-1">
                  {booking.bookingId}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {booking.destination && (
                <div className="flex gap-4 mb-6">
                  <img 
                    src={booking.destination?.image} 
                    alt={booking.destination?.name || 'Destination'}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{booking.destination?.name}</h3>
                    <p className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {booking.destination?.state || 'India'}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Travel Date</p>
                    <p className="font-medium">{new Date(booking.travelDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Travelers</p>
                    <p className="font-medium">{booking.numberOfPersons} Person(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Transport</p>
                    <p className="font-medium">{booking.transport}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{booking.guestPhone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="text-2xl font-bold text-orange-600">₹{booking.totalCost?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Section */}
          {showRating ? (
            <Card className="border-0 shadow-lg mb-6">
              <CardContent className="p-6 text-center">
                <h3 className="font-medium mb-4">How was your booking experience?</h3>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="p-1">
                      <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={submitRating} className="bg-gradient-to-r from-orange-500 to-pink-500">
                    Submit Rating
                  </Button>
                  <Button variant="outline" onClick={() => setShowRating(false)}>
                    Not Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 py-6">
              Track Your Trip <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/states">
              <Button variant="outline" className="w-full py-6">
                Explore More Destinations
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
