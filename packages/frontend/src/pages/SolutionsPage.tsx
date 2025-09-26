import { Link } from 'react-router-dom'

export function SolutionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Digital Solutions</h1>
        <p className="text-gray-600">
          Discover innovative solutions to transform your business operations.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select className="input">
              <option>All Categories</option>
              <option>Analytics</option>
              <option>Automation</option>
              <option>CRM</option>
              <option>Marketing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <select className="input">
              <option>Any Price</option>
              <option>$0 - $100</option>
              <option>$100 - $500</option>
              <option>$500+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select className="input">
              <option>Any Rating</option>
              <option>4+ Stars</option>
              <option>3+ Stars</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample solution cards */}
        {[
          { id: 1, name: "Analytics Dashboard Pro", price: 299, monthlyPrice: 29, category: "Analytics" },
          { id: 2, name: "CRM Automation Suite", price: 199, monthlyPrice: 19, category: "CRM" },
          { id: 3, name: "Marketing Campaign Manager", price: 149, monthlyPrice: 15, category: "Marketing" },
          { id: 4, name: "Inventory Management System", price: 249, monthlyPrice: 25, category: "Automation" },
          { id: 5, name: "Customer Support Portal", price: 179, monthlyPrice: 18, category: "CRM" },
          { id: 6, name: "Sales Analytics Platform", price: 329, monthlyPrice: 33, category: "Analytics" }
        ].map((solution) => (
          <div key={solution.id} className="card p-6">
            <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-primary-600 font-semibold">{solution.category}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {solution.name}
            </h3>
            <p className="text-gray-600 mb-4">
              A comprehensive {solution.category.toLowerCase()} solution for your business needs.
            </p>
            <div className="mb-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-primary-600">${solution.price}</span>
                <span className="text-sm text-gray-500">one-time</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-semibold text-green-600">${solution.monthlyPrice}/mo</span>
                <span className="text-sm text-gray-500">subscription</span>
              </div>
            </div>
            <Link to={`/solutions/${solution.id}`} className="btn-primary w-full">
              View Details & Subscribe
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}