'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Star, 
  Plane, 
  ArrowLeft,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  IndianRupee,
  Navigation
} from 'lucide-react'
import { indianStates } from '@/lib/data'
import { toast } from 'sonner'

export default function DestinationPage() {
  const params = useParams()
  const router = useRouter()
  const [destination, setDestination] = useState<any>(null)
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    // Find destination and state synchronously
    for (const s of indianStates) {
      const found = s.destinations.find((d: any) => d.id === params.id)
      if (found) {
        // Use RAF to defer state updates outside effect
        requestAnimationFrame(() => {
          setDestination(found)
          setState(s)
        })
        break
      }
    }
  }, [params.id])

  if (!destination || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination...</p>
        </div>
      </div>
    )
  }

  const handleBookNow = () => {
    const user = localStorage.getItem('user')
    if (!user) {
      toast.error('Please login to book a trip')
      router.push('/auth/login')
      return
    }
    router.push(`/booking/${destination.id}`)
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
            <Link href="/dashboard" className="text-gray-600 hover:text-orange-600">My Trips</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-600">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/states" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden h-[400px]">
              <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-white/90 text-gray-900 text-lg px-3 py-1">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {destination.rating} Rating
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <Badge className="mb-2">{state.name}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{destination.name}</h1>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Trip Price</span>
                  <div className="flex items-center text-orange-600">
                    <IndianRupee className="w-5 h-5" />
                    <span className="text-2xl font-bold">{destination.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 font-normal">/person</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Recommended: 3-4 days trip</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Best for: Solo, Couples, Groups</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Best time: Oct - March</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-medium">Price includes:</p>
                  <div className="space-y-1">
                    {['Accommodation', 'Local transport', 'Tour guide', 'Meals (optional)'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleBookNow} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg py-6">
                  Book This Trip
                </Button>
                <p className="text-xs text-center text-gray-500">Free cancellation up to 48 hours before travel</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-lg">
              <CardHeader><CardTitle>About This Destination</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{destination.description}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader><CardTitle>Highlights</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {destination.highlights.map((highlight: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Location Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden h-[300px] bg-gray-100">
                  <iframe src={destination.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {destination.name}, {state.name}, India
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader><CardTitle>Quick Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{destination.rating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">State</span>
                  <span className="font-medium">{state.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Base Price</span>
                  <span className="font-medium">₹{destination.price.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader><CardTitle>More in {state.name}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {state.destinations.filter((d: any) => d.id !== destination.id).map((d: any) => (
                  <Link key={d.id} href={`/destination/${d.id}`}>
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <img src={d.image} alt={d.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{d.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {d.rating}
                          <span className="mx-1">•</span>
                          ₹{d.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
