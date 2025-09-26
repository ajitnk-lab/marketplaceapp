import { useState } from 'react'
import { RefreshCw, Calendar, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'

export function SubscriptionsPage() {
  const [subscriptions] = useState([
    {
      id: 1,
      name: "Analytics Dashboard Pro",
      plan: "Monthly",
      price: 29,
      status: "active",
      nextBilling: "2024-02-15",
      category: "Analytics"
    },
    {
      id: 2,
      name: "CRM Automation Suite", 
      plan: "Yearly",
      price: 199,
      status: "active",
      nextBilling: "2024-12-01",
      category: "CRM"
    },
    {
      id: 3,
      name: "Marketing Campaign Manager",
      plan: "Monthly", 
      price: 15,
      status: "cancelled",
      nextBilling: "2024-01-30",
      category: "Marketing"
    }
  ])

  const handleCancelSubscription = (id: number) => {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      alert('Subscription cancelled. You will retain access until the end of your billing period.')
    }
  }

  const handleReactivateSubscription = (id: number) => {
    alert('Subscription reactivated successfully!')
  }

  const handleUpdatePayment = (id: number) => {
    alert('Redirecting to update payment method...')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />
      case 'past_due':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <RefreshCw className="w-4 h-4" />
    }
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
  const totalMonthlySpend = activeSubscriptions
    .filter(sub => sub.plan === 'Monthly')
    .reduce((sum, sub) => sum + sub.price, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Subscriptions</h1>
        <p className="text-gray-600">
          Manage your active subscriptions and billing information.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
              <p className="text-2xl font-bold text-primary-600">{activeSubscriptions.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Spend</h3>
              <p className="text-2xl font-bold text-green-600">${totalMonthlySpend}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Next Billing</h3>
              <p className="text-lg font-semibold text-blue-600">
                {activeSubscriptions.length > 0 
                  ? new Date(Math.min(...activeSubscriptions.map(sub => new Date(sub.nextBilling).getTime()))).toLocaleDateString()
                  : 'None'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">{subscription.category}</span>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-600">{subscription.plan} Plan</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                      {getStatusIcon(subscription.status)}
                      <span className="ml-1 capitalize">{subscription.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Next billing: {new Date(subscription.nextBilling).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${subscription.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    per {subscription.plan.toLowerCase()}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  {subscription.status === 'active' ? (
                    <>
                      <button 
                        onClick={() => handleUpdatePayment(subscription.id)}
                        className="btn-outline text-sm px-3 py-1"
                      >
                        Update Payment
                      </button>
                      <button 
                        onClick={() => handleCancelSubscription(subscription.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleReactivateSubscription(subscription.id)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <div className="text-center py-12">
          <RefreshCw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscriptions</h3>
          <p className="text-gray-600 mb-6">
            You don't have any active subscriptions yet.
          </p>
          <a href="/solutions" className="btn-primary">
            Browse Solutions
          </a>
        </div>
      )}
    </div>
  )
}