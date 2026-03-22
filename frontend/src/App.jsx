import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { ErrorBoundary } from '@components/ErrorBoundary'
import { SkipLink } from '@components/AccessibleComponents'
import Header from '@components/Header'
import Footer from '@components/Footer'
import Home from '@pages/Home'
import Verify from '@pages/Verify'
import Register from '@pages/Register'
import Transfer from '@pages/Transfer'
import Dashboard from '@pages/Dashboard'
import BatchRegister from '@pages/BatchRegister'
import { showError } from '@utils/toast'
import { getErrorMessage } from '@utils/errorMessages'

function App() {
  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      const errorMsg = getErrorMessage(event.reason)
      showError(errorMsg.message)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <ErrorBoundary>
      <Router>
        <SkipLink />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }
          }}
        />
        <div className="min-h-screen bg-void text-white font-sans flex flex-col">
          <Header />
          <motion.main
            id="main-content"
            className="flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/verify/:productId" element={<Verify />} />
              <Route path="/register" element={<Register />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/batch-register" element={<BatchRegister />} />
            </Routes>
          </motion.main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
