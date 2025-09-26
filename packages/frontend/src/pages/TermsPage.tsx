export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using this marketplace platform, you accept and agree to be bound by 
            the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily use the marketplace platform for personal, 
            non-commercial transitory viewing only.
          </p>
          <p className="text-gray-700">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the platform</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Purchases and Payments</h2>
          <p className="text-gray-700">
            All purchases made through our platform are subject to our payment terms. 
            Prices are subject to change without notice. We reserve the right to refuse 
            or cancel orders at our discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms of Service, please contact us at 
            legal@marketplace.com
          </p>
        </section>
      </div>
    </div>
  )
}