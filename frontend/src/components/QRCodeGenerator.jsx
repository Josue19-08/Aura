import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { showSuccess, showError } from '../utils/toast'

export default function QRCodeGenerator({ productId, productName }) {
  const [downloaded, setDownloaded] = useState(false)

  // Generate verification URL
  const verificationUrl = `${window.location.origin}/verify/${productId}`

  const downloadQR = async () => {
    try {
      const svg = document.getElementById('qr-code-svg')
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')

        const downloadLink = document.createElement('a')
        downloadLink.download = `aura-qr-${productId}.png`
        downloadLink.href = pngFile
        downloadLink.click()

        setDownloaded(true)
        showSuccess('QR Code downloaded successfully!')
        setTimeout(() => setDownloaded(false), 2000)
      }

      img.onerror = () => {
        showError('Failed to download QR code')
      }

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    } catch (error) {
      console.error('Download error:', error)
      showError('Failed to download QR code')
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(verificationUrl)
    showSuccess('URL copied to clipboard!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-8 bg-slate/40 backdrop-blur-xl"
    >
      <h3 className="text-xl font-bold text-white mb-4">
        Product QR Code
      </h3>

      <div className="flex flex-col items-center gap-6">
        {/* QR Code Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="p-4 bg-white rounded-lg"
        >
          <QRCodeSVG
            id="qr-code-svg"
            value={verificationUrl}
            size={256}
            level="H"
            includeMargin={true}
          />
        </motion.div>

        {/* Product Info */}
        <div className="text-center w-full">
          <p className="text-fog/80 text-sm mb-1">
            Product ID: <span className="text-white font-mono">{productId}</span>
          </p>
          <p className="text-white font-medium mb-3">{productName}</p>

          <div className="p-3 bg-slate/60 backdrop-blur-sm rounded">
            <p className="text-fog/60 text-xs font-mono break-all">
              {verificationUrl}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={downloadQR}
            className="flex-1 px-6 py-3 bg-signal/10 hover:bg-signal/20
              transition-colors duration-300 backdrop-blur-sm"
          >
            <span className="text-signal font-medium">
              {downloaded ? '✓ Downloaded' : 'Download QR Code'}
            </span>
          </button>

          <button
            onClick={copyUrl}
            className="px-6 py-3 bg-slate/80 hover:bg-slate
              transition-colors duration-300"
          >
            <span className="text-white font-medium">
              Copy URL
            </span>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center text-fog/70 text-sm space-y-1">
          <p>✓ Scan this QR code to verify product authenticity</p>
          <p>✓ Print and attach to product packaging</p>
          <p>✓ Share with customers for easy verification</p>
        </div>
      </div>
    </motion.div>
  )
}
