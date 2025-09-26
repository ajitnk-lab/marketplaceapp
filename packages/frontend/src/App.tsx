import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { SolutionsPage } from './pages/SolutionsPage'
import { SolutionDetailPage } from './pages/SolutionDetailPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { PartnersPage } from './pages/PartnersPage'
import { SupportPage } from './pages/SupportPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { SubscriptionsPage } from './pages/SubscriptionsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/solutions/:id" element={<SolutionDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
      </Routes>
    </Layout>
  )
}

export default App