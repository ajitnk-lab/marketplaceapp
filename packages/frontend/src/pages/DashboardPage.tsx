export function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Manage your account and view your purchased solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Purchases
            </h3>
            <p className="text-3xl font-bold text-primary-600">12</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Spent
            </h3>
            <p className="text-3xl font-bold text-primary-600">$2,847</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Active Solutions
            </h3>
            <p className="text-3xl font-bold text-primary-600">8</p>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Purchases
              </h3>
              <a href="/subscriptions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Subscriptions →
              </a>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Solution {i + 1}</h4>
                    <p className="text-sm text-gray-600">Purchased 2 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">$299</p>
                    <p className="text-sm text-green-600">Active</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">John Doe</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">john@example.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900">January 2024</p>
              </div>
              <button className="btn-outline w-full mt-4">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}