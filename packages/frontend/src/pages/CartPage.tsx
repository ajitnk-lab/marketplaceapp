import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Advanced Analytics Dashboard Pro",
      price: 299,
      quantity: 1,
      category: "Analytics"
    },
    {
      id: 2,
      name: "CRM Automation Suite", 
      price: 199,
      quantity: 2,
      category: "CRM"
    }
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id))
    } else {
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Discover amazing solutions to transform your business
          </p>
          <Link to="/solutions" className="btn-primary">
            Browse Solutions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="card p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">{item.category}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">{item.category} Solution</p>
                    <p className="text-lg font-bold text-primary-600">${item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full mb-4">
              Proceed to Checkout
            </Link>
            
            <Link to="/solutions" className="btn-outline w-full">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}