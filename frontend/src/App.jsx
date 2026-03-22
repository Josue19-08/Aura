import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@components/Header'
import Footer from '@components/Footer'
import KeyboardHelpDialog from '@components/KeyboardHelpDialog'
import WalletRoute from '@components/WalletRoute'
import { notifyError } from '@utils/toast'

const Home = lazy(() => import('@pages/Home'))
const Verify = lazy(() => import('@pages/Verify'))
const Register = lazy(() => import('@pages/Register'))
const Transfer = lazy(() => import('@pages/Transfer'))
const Dashboard = lazy(() => import('@pages/Dashboard'))
const BatchRegister = lazy(() => import('@pages/BatchRegister'))

function RouteFallback() {
  return (
    <div className="container mx-auto px-6 py-20 text-center" aria-live="polite">
      <div className="loading-skeleton h-10 w-10 rounded-full mx-auto mb-4" />
      <p className="text-fog">Loading page...</p>
    </div>
  )
}

function App() {
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false)

  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection', event.reason)
      notifyError(event.reason)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }, [])

  useEffect(() => {
    const handleKeyboardHelp = (event) => {
      if (event.key === '?' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const tagName = document.activeElement?.tagName
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          return
        }

        event.preventDefault()
        setIsKeyboardHelpOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyboardHelp)
    return () => window.removeEventListener('keydown', handleKeyboardHelp)
  }, [])

  return (
    <Router>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <KeyboardHelpDialog open={isKeyboardHelpOpen} onClose={() => setIsKeyboardHelpOpen(false)} />
      <div className="min-h-screen bg-void text-white font-sans flex flex-col">
        <Header onOpenKeyboardHelp={() => setIsKeyboardHelpOpen(true)} />
        <motion.main
          id="main-content"
          tabIndex="-1"
          className="flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/verify/:productId" element={<Verify />} />
              <Route path="/register" element={<WalletRoute><Register /></WalletRoute>} />
              <Route path="/transfer" element={<WalletRoute><Transfer /></WalletRoute>} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/batch-register" element={<WalletRoute><BatchRegister /></WalletRoute>} />
            </Routes>
          </Suspense>
        </motion.main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
