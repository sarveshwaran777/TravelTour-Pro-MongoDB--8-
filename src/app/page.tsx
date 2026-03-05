'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Plane, 
  Star, 
  Shield, 
  Clock, 
  Users, 
  Compass, 
  Mountain, 
  Palmtree, 
  Building2,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react'
import { indianStates } from '@/lib/data'

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    // Defer state update to avoid synchronous setState in effect
    const timer = requestAnimationFrame(() => {
      setIsClient(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  const featuredDestinations = [
    { name: 'Taj Mahal', state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400', rating: 4.9 },
    { name: 'Goa Beaches', state: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', rating: 4.7 },
    { name: 'Kerala Backwaters', state: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400', rating: 4.9 },
    { name: 'Rajasthan Forts', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400', rating: 4.8 },
  ]

  const stats = [
    { icon: MapPin, value: '28', label: 'States Covered' },
    { icon: Palmtree, value: '84+', label: 'Destinations' },
    { icon: Users, value: '50K+', label: 'Happy Travelers' },
    { icon: Star, value: '4.8', label: 'Average Rating' },
  ]

  const features = [
    {
      icon: Compass,
      title: 'Explore India',
      description: 'Discover all 28 states with 3 unique destinations each. From Himalayan peaks to tropical beaches.'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Multiple payment options including UPI, cards, and wallets. Your transactions are always protected.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Travel guides available round the clock. Get assistance whenever you need it.'
    },
    {
      icon: CreditCard,
      title: 'Best Prices',
      description: 'Transparent pricing with no hidden charges. Get the best value for your travel budget.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-orange-50">
      {/* Header */}
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
            <Link href="/states" className="text-gray-600 hover:text-orange-600 transition-colors">
              Explore
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-orange-600 transition-colors">
              My Trips
            </Link>
            <Link href="/admin/login" className="text-gray-600 hover:text-orange-600 transition-colors">
              Admin
            </Link>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-100">
              🎉 Explore All 28 States of India
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Discover Incredible India
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              From the Himalayan peaks to tropical beaches, ancient temples to modern cities. 
              Book your dream trip with professional travel guides and secure payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/states">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg px-8 py-6">
                  Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 hidden lg:block animate-bounce">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <Mountain className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="absolute top-40 right-20 hidden lg:block animate-bounce delay-300">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <Palmtree className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="absolute bottom-20 left-1/4 hidden lg:block animate-bounce delay-500">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <Building2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked destinations loved by thousands of travelers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-900">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {dest.rating}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{dest.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {dest.state}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/states">
              <Button variant="outline" size="lg" className="border-2">
                View All Destinations <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TravelTour Pro?</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              We make travel planning easy, secure, and memorable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* States Grid Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by State</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each state has 3 unique destinations waiting for you
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {indianStates.slice(0, 14).map((state) => (
              <Link key={state.id} href={`/states?state=${state.id}`}>
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border hover:border-orange-300 text-center">
                  <span className="text-sm font-medium text-gray-700">{state.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-3">
            {indianStates.slice(14).map((state) => (
              <Link key={state.id} href={`/states?state=${state.id}`}>
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border hover:border-orange-300 text-center">
                  <span className="text-sm font-medium text-gray-700">{state.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Book your dream trip in 4 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Choose Destination', desc: 'Browse 84 destinations across 28 states' },
              { step: '02', title: 'Enter Details', desc: 'Provide traveler and travel information' },
              { step: '03', title: 'Select Options', desc: 'Choose transport and food preferences' },
              { step: '04', title: 'Confirm & Pay', desc: 'Secure payment with multiple options' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of travelers who have explored India with us. 
              Create your account and start planning your next adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/states">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Browse Destinations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">TravelTour Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for exploring incredible India. 
                Professional travel booking with secure payments and dedicated support.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/states" className="hover:text-white transition-colors">Explore Destinations</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">My Trips</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +91 1800-123-4567
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@traveltourpro.com
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Payment Partners</h4>
              <div className="flex flex-wrap gap-2">
                {['Google Pay', 'PhonePe', 'Paytm', 'PayPal', 'BHIM UPI', 'Cards'].map((method) => (
                  <Badge key={method} variant="outline" className="border-gray-700 text-gray-400">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 TravelTour Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
