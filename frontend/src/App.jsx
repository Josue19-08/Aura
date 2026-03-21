import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@components/Header'
import Footer from '@components/Footer'
import Home from '@pages/Home'
import Verify from '@pages/Verify'
import Register from '@pages/Register'
import Transfer from '@pages/Transfer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-void text-white font-sans flex flex-col">
        <Header />
        <motion.main
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
          </Routes>
        </motion.main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
