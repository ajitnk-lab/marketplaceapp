import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, DollarSign, Users } from 'lucide-react'

export function PartnersPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Become a Partner
              <span className="text-primary-600 block">Grow Your Business</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our marketplace and reach thousands of customers looking for 
              innovative digital solutions. Start selling your products today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="btn-primary">
                Apply Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <button className="btn-outline">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access our established customer base and powerful platform tools 
              to accelerate your business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Large Customer Base</h3>
              <p className="text-gray-600">
                Reach thousands of businesses actively looking for digital solutions 
                to improve their operations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Competitive Commission</h3>
              <p className="text-gray-600">
                Keep up to 85% of your sales revenue with our transparent and 
                competitive commission structure.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Setup</h3>
              <p className="text-gray-600">
                Get started quickly with our streamlined onboarding process and 
                comprehensive partner support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Partner Requirements
            </h2>
            
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Proven track record in software development or digital solutions
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    High-quality products that meet our marketplace standards
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Commitment to customer support and product maintenance
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Valid business registration and tax documentation
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Agreement to our terms of service and partner guidelines
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful partners already growing their business 
            through our marketplace platform.
          </p>
          <Link to="/auth" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Apply to Become a Partner
          </Link>
        </div>
      </section>
    </div>
  )
}