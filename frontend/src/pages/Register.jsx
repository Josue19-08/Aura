import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import QRCode from 'qrcode'
import WalletConnect from '@components/WalletConnect'
import useContract from '@hooks/useContract'
import { uploadToIPFS } from '@utils/api'
import { ErrorMessage, SuccessMessage } from '@components/FeedbackMessage'
import { LoadingButton, LoadingOverlay } from '@components/LoadingStates'
import { notifyError, notifyInfo, notifySuccess } from '@utils/toast'

export default function Register() {
  const productNameId = useId()
  const lotIdId = useId()
  const originId = useId()
  const manufacturingDateId = useId()
  const expiryDateId = useId()
  const certificatesId = useId()
  const imagesId = useId()
  const { address, isConnected } = useAccount()
  const { registerProduct, isLoading: isRegistering } = useContract()

  const [formData, setFormData] = useState({
    productName: '',
    lotId: '',
    origin: '',
    manufacturingDate: '',
    expiryDate: '',
  })

  const [files, setFiles] = useState({
    certificates: null,
    images: null,
  })

  const [ipfsHash, setIpfsHash] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [productId, setProductId] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files,
    })
  }

  const handleUploadMetadata = async () => {
    if (!files.certificates && !files.images) {
      setError('Please upload at least one file')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const metadata = {
        ...formData,
        certificates: [],
        images: [],
      }

      const hash = await uploadToIPFS(metadata, files)
      setIpfsHash(hash)
      notifySuccess('Metadata uploaded to IPFS.')
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload metadata')
      notifyError(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRegister = async () => {
    if (!ipfsHash) {
      setError('Please upload metadata first')
      return
    }

    setError(null)

    try {
      const result = await registerProduct(
        formData.lotId,
        formData.productName,
        formData.origin,
        ipfsHash
      )

      setProductId(result.productId)
      setTxHash(result.hash)
      await generateQRCode(result.productId)
      notifySuccess('Product registered successfully.')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Failed to register product')
      notifyError(err)
    }
  }

  const generateQRCode = async (id) => {
    try {
      const qrData = `${window.location.origin}/verify/${id}`
      const url = await QRCode.toDataURL(qrData, {
        width: 512,
        margin: 2,
        color: {
          dark: '#00E5CC',
          light: '#0A0A0F',
        },
      })
      setQrCodeUrl(url)
    } catch (err) {
      console.error('QR generation error:', err)
    }
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.download = `aura-product-${productId}.png`
    link.href = qrCodeUrl
    link.click()
  }

  const handleReset = () => {
    setFormData({
      productName: '',
      lotId: '',
      origin: '',
      manufacturingDate: '',
      expiryDate: '',
    })
    setFiles({ certificates: null, images: null })
    setIpfsHash(null)
    setProductId(null)
    setTxHash(null)
    setQrCodeUrl(null)
    setError(null)
    notifyInfo('Registration form reset.')
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h1 className="text-h1 font-display mb-6">Register Product</h1>
          <p className="text-fog mb-8">
            Connect your wallet to register products on the blockchain
          </p>
          <div className="card inline-block">
            <WalletConnect />
          </div>
        </motion.div>
      </div>
    )
  }

  if (productId && qrCodeUrl) {
    return (
      <div className="container mx-auto px-6 py-12">
        <LoadingOverlay show={isUploading} label="Uploading metadata to IPFS..." />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-signal/20 border-2 border-signal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-h2 font-display mb-4">Product Registered!</h1>
          <div className="space-y-2 mb-8">
            <p className="text-fog">
              Product ID: <span className="font-mono text-signal">#{productId}</span>
            </p>
            {txHash && (
              <p className="text-fog text-sm">
                Tx:{' '}
                <a
                  href={`https://testnet.snowtrace.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-signal hover:underline break-all"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </a>
              </p>
            )}
          </div>

          <div className="card mb-8">
            <h3 className="text-h3 font-sans mb-6">QR Code</h3>
            <img
              src={qrCodeUrl}
              alt="Product QR Code"
              className="max-w-xs mx-auto mb-6 rounded-lg"
            />
            <button onClick={handleDownloadQR} type="button" className="btn-primary">
              Download QR Code
            </button>
          </div>

          <div className="mb-8">
            <SuccessMessage
              title="Registration confirmed"
              message="The product is now ready for public verification through its QR code."
              linkHref={txHash ? `https://testnet.snowtrace.io/tx/${txHash}` : null}
              linkLabel={txHash ? 'View transaction on Snowtrace' : null}
            />
          </div>

          <button onClick={handleReset} type="button" className="btn-outline">
            Register Another Product
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <LoadingOverlay show={isUploading} label="Uploading metadata to IPFS..." />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-h1 font-display mb-4 text-center">
          Register Product
        </h1>
        <p className="text-fog text-center mb-12">
          Connected: <span className="font-mono text-signal">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        </p>

        {error && (
          <div className="mb-6">
            <ErrorMessage id="register-error" error={error} />
          </div>
        )}

        <div className="card space-y-6">
          {/* Product Information */}
          <div>
            <label htmlFor={productNameId} className="label">Product Name</label>
            <input
              id={productNameId}
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="Ibuprofeno 400mg"
              className="input-field"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={lotIdId} className="label">Lot ID</label>
              <input
                id={lotIdId}
                type="text"
                name="lotId"
                value={formData.lotId}
                onChange={handleInputChange}
                placeholder="2026-03-001"
                className="input-field"
                autoCapitalize="characters"
                required
              />
            </div>
            <div>
              <label htmlFor={originId} className="label">Origin</label>
              <input
                id={originId}
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                placeholder="Bogotá, Colombia"
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={manufacturingDateId} className="label">Manufacturing Date</label>
              <input
                id={manufacturingDateId}
                type="date"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor={expiryDateId} className="label">Expiry Date</label>
              <input
                id={expiryDateId}
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* File Uploads */}
          <div>
            <label htmlFor={certificatesId} className="label">Certificates (PDF)</label>
            <input
              id={certificatesId}
              type="file"
              name="certificates"
              onChange={handleFileChange}
              accept=".pdf"
              multiple
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor={imagesId} className="label">Product Images</label>
            <input
              id={imagesId}
              type="file"
              name="images"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="input-field"
            />
          </div>

          {/* IPFS Upload */}
          <div className="border-t border-fog/20 pt-6">
            {!ipfsHash ? (
              <LoadingButton
                onClick={handleUploadMetadata}
                type="button"
                loading={isUploading}
                loadingLabel="Uploading metadata..."
                className="btn-secondary w-full"
              >
                Upload Metadata to IPFS
              </LoadingButton>
            ) : (
              <div className="bg-signal/10 border border-signal rounded-lg p-4">
                <p className="text-sm text-fog mb-2">IPFS Hash</p>
                <p className="font-mono text-signal break-all">{ipfsHash}</p>
              </div>
            )}
          </div>

          {/* Register Button */}
          <LoadingButton
            onClick={handleRegister}
            type="button"
            loading={isRegistering}
            loadingLabel="Registering on-chain..."
            disabled={!ipfsHash}
            className="btn-primary w-full"
          >
            Register Product
          </LoadingButton>
        </div>
      </motion.div>
    </div>
  )
}
