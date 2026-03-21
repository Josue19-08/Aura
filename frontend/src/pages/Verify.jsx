import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import QrScanner from 'qr-scanner'
import VerificationResult from '@components/VerificationResult'
import { verifyProduct } from '@utils/api'

export default function Verify() {
  const { productId: urlProductId } = useParams()
  const navigate = useNavigate()
  const [productId, setProductId] = useState(urlProductId || '')
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (urlProductId) {
      handleVerify(urlProductId)
    }
  }, [urlProductId])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      setIsScanning(true)
      setError(null)

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          const scannedId = extractProductId(result.data)
          if (scannedId) {
            stopScanning()
            navigate(`/verify/${scannedId}`)
          }
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      )

      scannerRef.current = scanner
      await scanner.start()
    } catch (err) {
      console.error('Scanner error:', err)
      setError('Camera access denied or not available')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current.destroy()
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  const extractProductId = (qrData) => {
    const match = qrData.match(/product[\/:](\d+)/)
    return match ? match[1] : qrData
  }

  const handleVerify = async (id) => {
    const verifyId = id || productId
    if (!verifyId) {
      setError('Please enter a product ID')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await verifyProduct(verifyId)
      setResult(data)
    } catch (err) {
      console.error('Verification error:', err)
      setError(err.message || 'Failed to verify product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setProductId('')
    setResult(null)
    setError(null)
    navigate('/verify')
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-h1 font-display mb-4 text-center">
          Verify Product
        </h1>
        <p className="text-fog text-center mb-12">
          Scan QR code or enter product ID to verify authenticity
        </p>

        {!result && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Manual Input */}
            <div className="card">
              <h3 className="text-h3 font-sans mb-4">Enter Product ID</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Product ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  className="input-field"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleVerify()}
                  disabled={isLoading || !productId}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Product'}
                </button>
              </div>
            </div>

            {/* QR Scanner */}
            <div className="card">
              <h3 className="text-h3 font-sans mb-4">Scan QR Code</h3>
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  className="btn-outline w-full"
                >
                  Start Camera
                </button>
              ) : (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={stopScanning}
                    className="btn-secondary w-full"
                  >
                    Stop Scanning
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-caution/20 border border-caution text-caution rounded-lg p-6 mb-8"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠</span>
              <div>
                <h3 className="font-semibold mb-1">Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block w-16 h-16 border-4 border-signal/30 border-t-signal rounded-full animate-spin mb-4" />
            <p className="text-fog">Verifying product...</p>
          </motion.div>
        )}

        {/* Verification Result */}
        {result && (
          <div>
            <VerificationResult result={result} />
            <div className="text-center mt-8">
              <button onClick={handleReset} className="btn-outline">
                Verify Another Product
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
