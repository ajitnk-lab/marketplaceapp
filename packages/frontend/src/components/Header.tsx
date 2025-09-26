import { Link } from 'react-router-dom'
import { Search, ShoppingCart, User } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Marketplace</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/solutions" className="text-gray-700 hover:text-primary-600 transition-colors">
              Solutions
            </Link>
            <Link to="/partners" className="text-gray-700 hover:text-primary-600 transition-colors">
              Partners
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search solutions..."
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Link>
            <Link 
              to="/auth" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}