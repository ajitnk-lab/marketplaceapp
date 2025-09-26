export function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
        <p className="text-xl text-gray-600">
          Get help with your marketplace experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">How do I purchase a solution?</h3>
              <p className="text-gray-600 text-sm mt-1">
                Browse our catalog, select a solution, and follow the checkout process.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm mt-1">
                We accept all major credit cards and digital payment methods.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">How do I become a partner?</h3>
              <p className="text-gray-600 text-sm mt-1">
                Visit our Partners page and submit an application with your business details.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Support
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input type="email" className="input" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input type="text" className="input" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea 
                className="input min-h-[100px] resize-none" 
                placeholder="Describe your issue..."
              ></textarea>
            </div>
            <button className="btn-primary w-full">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}