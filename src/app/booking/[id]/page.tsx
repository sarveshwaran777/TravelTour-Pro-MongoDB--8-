'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Plane, 
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Car,
  Train,
  CheckCircle,
  IndianRupee
} from 'lucide-react'
import { indianStates, transportOptions, foodOptions, calculateTotalCost } from '@/lib/data'
import { toast } from 'sonner'

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [destination, setDestination] = useState<any>(null)
  const [state, setState] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestAddress: '',
    guestAge: '',
    travelDate: '',
    numberOfPersons: 1,
    transport: 'CAR',
    foodPreference: 'VEG'
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const u = JSON.parse(userData)
      setUser(u)
      setFormData(prev => ({
        ...prev,
        guestName: u.name || '',
        guestEmail: u.email || '',
        guestPhone: u.phone || '',
        guestAddress: u.address || '',
        guestAge: u.age?.toString() || ''
      }))
    }
    
    for (const s of indianStates) {
      const found = s.destinations.find((d: any) => d.id === params.id)
      if (found) {
        setDestination(found)
        setState(s)
        break
      }
    }
  }, [params.id])

  if (!destination || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const totalCost = calculateTotalCost(
    destination.price,
    formData.numberOfPersons,
    formData.transport,
    formData.foodPreference
  )

  const handleNext = () => {
    if (step === 1) {
      if (!formData.guestName || !formData.guestEmail || !formData.guestPhone || !formData.travelDate) {
        toast.error('Please fill all required fields')
        return
      }
    }
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      console.log('Submitting booking...')
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          guestAddress: formData.guestAddress,
          guestAge: formData.guestAge ? parseInt(formData.guestAge) : null,
          travelDate: formData.travelDate,
          destinationId: destination.id,
          userId: user?.id || null,
          totalCost: totalCost,
          numberOfPersons: parseInt(formData.numberOfPersons.toString()),
          transport: formData.transport,
          foodPreference: formData.foodPreference
        })
      })
      
      const data = await response.json()
      console.log('Booking response:', data)
      
      if (response.ok && data.booking) {
        toast.success('Booking created!')
        router.push(`/payment/${data.booking.id}`)
      } else {
        console.error('Booking failed:', data)
        toast.error(data.error || 'Booking failed')
        if (data.details) {
          console.error('Error details:', data.details)
        }
      }
    } catch (error: any) {
      console.error('Booking error:', error)
      toast.error('Something went wrong: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Personal Details', description: 'Your information' },
    { id: 2, title: 'Transport', description: 'Choose transport' },
    { id: 3, title: 'Food Preference', description: 'Select meals' },
    { id: 4, title: 'Review & Confirm', description: 'Final details' }
  ]

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
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Welcome, {user?.name || 'Guest'}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/destination/${destination.id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Destination
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div key={s.id} className={`flex items-center gap-2 ${step >= s.id ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s.id ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                  {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.id}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
          <Progress value={(step / steps.length) * 100} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>{steps[step - 1].title}</CardTitle>
                <CardDescription>{steps[step - 1].description}</CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="name" className="pl-10" value={formData.guestName} onChange={(e) => setFormData({...formData, guestName: e.target.value})} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" value={formData.guestAge} onChange={(e) => setFormData({...formData, guestAge: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="email" type="email" className="pl-10" value={formData.guestEmail} onChange={(e) => setFormData({...formData, guestEmail: e.target.value})} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="phone" type="tel" className="pl-10" value={formData.guestPhone} onChange={(e) => setFormData({...formData, guestPhone: e.target.value})} required />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="address" className="pl-10" value={formData.guestAddress} onChange={(e) => setFormData({...formData, guestAddress: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="travelDate">Travel Date *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="travelDate" type="date" className="pl-10" value={formData.travelDate} onChange={(e) => setFormData({...formData, travelDate: e.target.value})} min={new Date().toISOString().split('T')[0]} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="persons">Number of Persons *</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="persons" type="number" className="pl-10" value={formData.numberOfPersons} onChange={(e) => setFormData({...formData, numberOfPersons: parseInt(e.target.value) || 1})} min={1} max={20} required />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <RadioGroup value={formData.transport} onValueChange={(value) => setFormData({...formData, transport: value})}>
                      {transportOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{option.icon}</span>
                                  <span className="font-medium">{option.name}</span>
                                </div>
                                <p className="text-sm text-gray-500">{option.description}</p>
                              </div>
                              <Badge variant="secondary" className="text-lg">₹{option.basePrice.toLocaleString()}</Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <RadioGroup value={formData.foodPreference} onValueChange={(value) => setFormData({...formData, foodPreference: value})}>
                      {foodOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={option.id} id={`food-${option.id}`} />
                          <Label htmlFor={`food-${option.id}`} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{option.icon}</span>
                                  <span className="font-medium">{option.name}</span>
                                </div>
                                <p className="text-sm text-gray-500">{option.description}</p>
                              </div>
                              <Badge variant="secondary">₹{option.perDayCost}/day</Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Traveler Details</h4>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">Name:</span> {formData.guestName}</div>
                        <div><span className="text-gray-500">Email:</span> {formData.guestEmail}</div>
                        <div><span className="text-gray-500">Phone:</span> {formData.guestPhone}</div>
                        <div><span className="text-gray-500">Travel Date:</span> {new Date(formData.travelDate).toLocaleDateString()}</div>
                        <div><span className="text-gray-500">Persons:</span> {formData.numberOfPersons}</div>
                        <div><span className="text-gray-500">Transport:</span> {transportOptions.find(t => t.id === formData.transport)?.name}</div>
                        <div><span className="text-gray-500">Food:</span> {foodOptions.find(f => f.id === formData.foodPreference)?.name}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>
                  {step < 4 ? (
                    <Button onClick={handleNext} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600" disabled={loading}>
                      {loading ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-4">
                  <img src={destination.image} alt={destination.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium">{destination.name}</p>
                    <p className="text-sm text-gray-500">{state.name}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Badge variant="secondary">₹{destination.price.toLocaleString()}/person</Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 my-4">
                  <div className="flex justify-between text-sm">
                    <span>Base Price × {formData.numberOfPersons}</span>
                    <span>₹{(destination.price * formData.numberOfPersons).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Transport ({transportOptions.find(t => t.id === formData.transport)?.name})</span>
                    <span>₹{transportOptions.find(t => t.id === formData.transport)?.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Food ({foodOptions.find(f => f.id === formData.foodPreference)?.name})</span>
                    <span>₹{(foodOptions.find(f => f.id === formData.foodPreference)?.perDayCost || 0) * 3}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>₹500</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span className="text-orange-600">₹{totalCost.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
