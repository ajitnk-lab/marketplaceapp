import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, Shield } from 'lucide-react'

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Digital Solutions
              <span className="text-primary-600 block">That Transform Business</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with innovative partners and find the perfect digital solutions 
              to accelerate your business growth. From automation tools to analytics platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/solutions" className="btn-primary">
                Browse Solutions
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link to="/partners" className="btn-outline">
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Marketplace?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a secure, reliable platform that connects businesses with 
              the best digital solutions available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Solutions</h3>
              <p className="text-gray-600">
                All solutions are carefully vetted and reviewed to ensure they meet 
                our high standards for quality and reliability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Partners</h3>
              <p className="text-gray-600">
                Work with verified partners who have proven track records of 
                delivering exceptional digital solutions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Platform</h3>
              <p className="text-gray-600">
                Your transactions and data are protected with enterprise-grade 
                security and compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using our marketplace to find 
            and implement digital solutions.
          </p>
          <Link to="/solutions" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Explore Solutions Now
          </Link>
        </div>
      </section>
    </div>
  )
}