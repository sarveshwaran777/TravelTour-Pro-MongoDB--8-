'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Star, 
  Search, 
  Plane, 
  ArrowLeft,
  Mountain,
  Palmtree,
  Building2,
  Filter,
  Grid,
  List
} from 'lucide-react'
import { indianStates } from '@/lib/data'

export default function StatesPage() {
  const searchParams = useSearchParams()
  const selectedStateId = searchParams.get('state')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedState, setSelectedState] = useState<string>(selectedStateId || '')

  const filteredStates = indianStates.filter(state => 
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.destinations.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const stateToShow = selectedState ? indianStates.find(s => s.id === selectedState) : null

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
            <Link href="/states" className="text-orange-600 font-medium">
              Explore
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-orange-600 transition-colors">
              My Trips
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

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Explore All <span className="text-orange-600">28 States</span> of India
          </h1>
          <p className="text-gray-600">
            Discover 84 unique destinations across incredible India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search states or destinations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* States Grid */}
        {stateToShow ? (
          // Show single state with destinations
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedState('')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All States
            </Button>
            
            <Card className="mb-8 overflow-hidden">
              <div className="relative h-64">
                <img 
                  src={stateToShow.image} 
                  alt={stateToShow.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{stateToShow.name}</h2>
                  <p className="text-white/80">{stateToShow.description}</p>
                  <Badge className="mt-3 bg-white/20 text-white">
                    {stateToShow.destinations.length} Destinations
                  </Badge>
                </div>
              </div>
            </Card>
            
            <h3 className="text-2xl font-bold mb-4">Destinations in {stateToShow.name}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateToShow.destinations.map((dest) => (
                <Link key={dest.id} href={`/destination/${dest.id}`}>
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
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
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-orange-500 text-white">
                          ₹{dest.price.toLocaleString()}/person
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{dest.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {dest.description.substring(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {dest.highlights.slice(0, 2).map((h, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {h}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          // Show all states
          <div className={viewMode === 'grid' 
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredStates.map((state) => (
              viewMode === 'grid' ? (
                <Card 
                  key={state.id} 
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedState(state.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={state.image} 
                      alt={state.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{state.name}</h3>
                      <p className="text-white/80 text-sm">
                        {state.destinations.length} Destinations
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2">{state.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {state.destinations.slice(0, 2).map((d, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {d.name}
                        </Badge>
                      ))}
                      {state.destinations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{state.destinations.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card 
                  key={state.id} 
                  className="overflow-hidden border-0 shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedState(state.id)}
                >
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img 
                        src={state.image} 
                        alt={state.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{state.name}</h3>
                        <Badge>{state.destinations.length} Destinations</Badge>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{state.description}</p>
                    </CardContent>
                  </div>
                </Card>
              )
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold">28</div>
              <div className="text-white/80">States</div>
            </div>
            <div>
              <div className="text-3xl font-bold">84+</div>
              <div className="text-white/80">Destinations</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.7+</div>
              <div className="text-white/80">Avg Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-white/80">Travelers</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
