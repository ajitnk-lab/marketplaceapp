export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            make a purchase, or contact us for support.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Account information (name, email, password)</li>
            <li>Payment information (processed securely by our payment partners)</li>
            <li>Communication preferences</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Improve our platform and develop new features</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
          <p className="text-gray-700">
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy or as required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibent text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at privacy@marketplace.com
          </p>
        </section>
      </div>
    </div>
  )
}