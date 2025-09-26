import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, ArrowLeft, Star, Shield, Download, RefreshCw, Check } from 'lucide-react'

export function SolutionDetailPage() {
  const { id } = useParams()
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('one-time')

  // Mock solution data - in real app this would come from API
  const solution = {
    id: id,
    name: "Advanced Analytics Dashboard Pro",
    oneTimePrice: 299,
    monthlyPrice: 29,
    yearlyPrice: 299, // 12 months for price of 10
    category: "Analytics",
    rating: 4.8,
    reviews: 127,
    description: "Transform your business data into actionable insights with our comprehensive analytics platform. Features real-time dashboards, predictive analytics, and custom reporting capabilities.",
    features: [
      "Real-time data visualization",
      "Predictive analytics engine", 
      "Custom dashboard builder",
      "API integrations",
      "24/7 customer support",
      "Mobile responsive design",
      "Export to PDF/Excel",
      "Role-based access control"
    ],
    benefits: [
      "Increase decision-making speed by 60%",
      "Reduce manual reporting time by 80%",
      "Improve data accuracy by 95%",
      "Scale to handle millions of data points"
    ],
    subscriptionFeatures: [
      "All one-time purchase features",
      "Automatic updates and new features",
      "Priority customer support",
      "Advanced analytics modules",
      "Custom integrations",
      "Data backup and sync"
    ]
  }

  const handleAddToCart = () => {
    setIsAddedToCart(true)
    // In real app: dispatch to cart state/context
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const handlePurchaseNow = () => {
    // In real app: redirect to checkout with selected plan
    alert(`Redirecting to secure checkout for ${selectedPlan} plan...`)
  }

  const handleSubscribe = () => {
    // In real app: redirect to subscription checkout
    alert(`Starting ${selectedPlan} subscription...`)
  }

  const getCurrentPrice = () => {
    switch (selectedPlan) {
      case 'monthly':
        return solution.monthlyPrice
      case 'yearly':
        return solution.yearlyPrice
      default:
        return solution.oneTimePrice
    }
  }

  const getPriceLabel = () => {
    switch (selectedPlan) {
      case 'monthly':
        return '/month'
      case 'yearly':
        return '/year'
      default:
        return 'one-time'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/solutions" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Solutions
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Solution Images */}
        <div>
          <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <span className="text-primary-600 font-semibold text-lg">{solution.category}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-20 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 transition-colors"></div>
            ))}
          </div>
        </div>

        {/* Solution Details */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full mb-2">
              {solution.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              {solution.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.floor(solution.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {solution.rating} ({solution.reviews} reviews)
            </span>
          </div>

          <p className="text-gray-600 mb-6">
            {solution.description}
          </p>

          {/* Pricing Plans */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* One-time Purchase */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === 'one-time' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('one-time')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">One-time</h4>
                  {selectedPlan === 'one-time' && <Check className="w-5 h-5 text-primary-600" />}
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  ${solution.oneTimePrice}
                </div>
                <p className="text-sm text-gray-600">Lifetime access</p>
              </div>

              {/* Monthly Subscription */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === 'monthly' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Monthly</h4>
                  {selectedPlan === 'monthly' && <Check className="w-5 h-5 text-primary-600" />}
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  ${solution.monthlyPrice}
                </div>
                <p className="text-sm text-gray-600">Per month</p>
              </div>

              {/* Yearly Subscription */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                  selectedPlan === 'yearly' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('yearly')}
              >
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 17%
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Yearly</h4>
                  {selectedPlan === 'yearly' && <Check className="w-5 h-5 text-primary-600" />}
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  ${solution.yearlyPrice}
                </div>
                <p className="text-sm text-gray-600">Per year</p>
              </div>
            </div>

            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-primary-600">${getCurrentPrice()}</span>
              <span className="text-gray-500 ml-2">{getPriceLabel()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            {selectedPlan === 'one-time' ? (
              <>
                <button 
                  onClick={handlePurchaseNow}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Purchase Now - ${getCurrentPrice()}
                </button>
                <button 
                  onClick={handleAddToCart}
                  className={`btn-outline w-full flex items-center justify-center transition-all ${
                    isAddedToCart ? 'bg-green-50 border-green-300 text-green-700' : ''
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleSubscribe}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Subscribe Now - ${getCurrentPrice()}{getPriceLabel()}
                </button>
                <button 
                  onClick={handlePurchaseNow}
                  className="btn-outline w-full flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Or Buy Once - ${solution.oneTimePrice}
                </button>
              </>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-500" />
                Secure Payment
              </div>
              <div className="flex items-center">
                <Download className="w-4 h-4 mr-1 text-blue-500" />
                Instant Download
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                30-Day Guarantee
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedPlan === 'one-time' ? 'Key Features' : 'Subscription Features'}
            </h3>
            <ul className="space-y-2 text-gray-600">
              {(selectedPlan === 'one-time' ? solution.features : solution.subscriptionFeatures).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            {selectedPlan !== 'one-time' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <RefreshCw className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Subscription Benefits</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Cancel anytime • Automatic updates • Priority support • New features included
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Business Benefits
            </h3>
            <ul className="space-y-2 text-gray-600">
              {solution.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}