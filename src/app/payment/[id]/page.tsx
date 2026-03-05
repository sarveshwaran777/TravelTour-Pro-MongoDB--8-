'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Plane, 
  CreditCard,
  Shield,
  Lock,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

const paymentMethods = [
  { id: 'GOOGLE_PAY', name: 'Google Pay', icon: '📱' },
  { id: 'PHONEPE', name: 'PhonePe', icon: '💜' },
  { id: 'PAYTM', name: 'Paytm', icon: '💙' },
  { id: 'PAYPAL', name: 'PayPal', icon: '🅿️' },
  { id: 'BHIM_UPI', name: 'BHIM UPI', icon: '🔶' },
  { id: 'CARD', name: 'Card Payment', icon: '💳' },
]

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('GOOGLE_PAY')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })

  const handlePayment = async () => {
    if (selectedPayment === 'CARD') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill all card details')
        return
      }
    }
    
    setLoading(true)
    try {
      console.log('Processing payment for booking:', params.id)
      
      const response = await fetch(`/api/bookings/${params.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: selectedPayment })
      })
      
      const data = await response.json()
      console.log('Payment response:', data)
      
      if (response.ok && data.booking) {
        toast.success('Payment successful!')
        router.push(`/confirmation/${data.booking.bookingId}`)
      } else {
        toast.error(data.error || 'Payment failed')
        console.error('Payment failed:', data)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error('Payment failed: ' + error.message)
    } finally {
      setLoading(false)
    }
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
          <div className="flex items-center gap-2 text-green-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

          <div className="grid gap-6">
            {/* Booking Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Booking ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-lg">{params.id}</p>
                <p className="text-sm text-gray-500 mt-2">Your booking has been created. Complete payment to confirm.</p>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id} 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPayment === method.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`} 
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                        <Label htmlFor={method.id} className="cursor-pointer">
                          <div className="text-center">
                            <div className="text-2xl mb-1">{method.icon}</div>
                            <div className="font-medium text-sm">{method.name}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {selectedPayment === 'CARD' && (
                  <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Cardholder Name</Label>
                      <Input placeholder="John Doe" value={cardDetails.name} onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" type="password" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Info */}
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <Lock className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Secure Transaction</p>
                <p className="text-sm text-green-600">Your payment information is encrypted and secure</p>
              </div>
            </div>

            {/* Pay Button */}
            <Button 
              onClick={handlePayment} 
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg py-6" 
              disabled={loading}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              By clicking "Pay Now", you agree to our terms and conditions
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
