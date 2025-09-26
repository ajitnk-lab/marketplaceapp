import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react'

export function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock cart data
  const cartItems = [
    { id: 1, name: "Advanced Analytics Dashboard Pro", price: 299, quantity: 1 },
    { id: 2, name: "CRM Automation Suite", price: 199, quantity: 2 }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert('Payment successful! Redirecting to dashboard...')
      // In real app: redirect to success page or dashboard
    }, 3000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/cart" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 mr-1 text-green-500" />
          SSL Encrypted • Secure Payment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input type="text" required className="input" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input type="text" required className="input" placeholder="Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input type="email" required className="input" placeholder="john@company.com" />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input type="text" className="input" placeholder="Your Company Inc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input type="text" required className="input" placeholder="123 Business St" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input type="text" required className="input" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select required className="input">
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input type="text" required className="input" placeholder="10001" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    id="card" 
                    name="payment" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600"
                  />
                  <label htmlFor="card" className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Credit/Debit Card
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="ml-8 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input 
                        type="text" 
                        required 
                        className="input" 
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input 
                          type="text" 
                          required 
                          className="input" 
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input 
                          type="text" 
                          required 
                          className="input" 
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    id="razorpay" 
                    name="payment" 
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600"
                  />
                  <label htmlFor="razorpay" className="flex items-center">
                    <div className="w-5 h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">R</span>
                    </div>
                    Razorpay (UPI, Wallets, NetBanking)
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isProcessing}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Complete Purchase - ${total.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center text-sm text-green-700">
                <Shield className="w-4 h-4 mr-2" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}