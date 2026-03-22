import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import WalletConnect from '@components/WalletConnect'
import CustodyTimeline from '@components/CustodyTimeline'
import useContract from '@hooks/useContract'
import { getProduct } from '@utils/api'
import { ErrorMessage, SuccessMessage } from '@components/FeedbackMessage'
import { LoadingButton } from '@components/LoadingStates'
import { notifyError, notifySuccess } from '@utils/toast'

export default function Transfer() {
  const newCustodianId = useId()
  const locationId = useId()
  const { address, isConnected } = useAccount()
  const { transferCustody, isLoading: isTransferring } = useContract()

  const [productId, setProductId] = useState('')
  const [product, setProduct] = useState(null)
  const [newCustodian, setNewCustodian] = useState('')
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleLoadProduct = async () => {
    if (!productId) {
      setError('Please enter a product ID')
      return
    }

    setIsLoading(true)
    setError(null)
    setProduct(null)

    try {
      const data = await getProduct(productId)

      if (data.currentCustodian.toLowerCase() !== address?.toLowerCase()) {
        setError('You are not the current custodian of this product')
        return
      }

      setProduct(data)
    } catch (err) {
      console.error('Load error:', err)
      setError(err)
      notifyError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (!newCustodian || !location) {
      setError('Please fill all fields')
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(newCustodian)) {
      setError('Invalid Ethereum address')
      return
    }

    setError(null)

    try {
      await transferCustody(productId, newCustodian, location)
      setSuccess(true)
      notifySuccess('Custody transferred successfully.')
    } catch (err) {
      console.error('Transfer error:', err)
      setError(err)
      notifyError(err)
    }
  }

  const handleReset = () => {
    setProductId('')
    setProduct(null)
    setNewCustodian('')
    setLocation('')
    setError(null)
    setSuccess(false)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h1 className="text-h1 font-display mb-6">Transfer Custody</h1>
          <p className="text-fog mb-8">
            Connect your wallet to transfer product custody
          </p>
          <div className="card inline-block">
            <WalletConnect />
          </div>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-signal/20 border-2 border-signal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-h2 font-display mb-4">Custody Transferred!</h1>
          <p className="text-fog mb-4">
            Product: <span className="font-mono text-signal">{product?.productName}</span>
          </p>
          <p className="text-fog mb-8">
            New custodian: <span className="font-mono text-signal">{newCustodian.slice(0, 6)}...{newCustodian.slice(-4)}</span>
          </p>

          <div className="mb-8">
            <SuccessMessage
              title="Custody updated"
              message="Aura recorded the new custodian and location note for this product."
            />
          </div>

          {product && (
            <div className="card mb-8 text-left">
              <h3 className="text-h3 font-sans mb-6 text-center">Updated Custody Chain</h3>
              <CustodyTimeline history={[...product.custodyHistory, {
                custodian: newCustodian,
                timestamp: Date.now(),
                locationNote: location
              }]} />
            </div>
          )}

          <button onClick={handleReset} type="button" className="btn-outline">
            Transfer Another Product
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-h1 font-display mb-4 text-center">
          Transfer Custody
        </h1>
        <p className="text-fog text-center mb-12">
          Connected: <span className="font-mono text-signal">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        </p>

        {error && (
          <div className="mb-6">
            <ErrorMessage id="transfer-error" error={error} />
          </div>
        )}

        {/* Load Product */}
        {!product && (
          <div className="card mb-8">
            <h3 className="text-h3 font-sans mb-6">Select Product</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLoadProduct()}
                className="input-field"
                aria-label="Product ID"
              />
              <LoadingButton
                onClick={handleLoadProduct}
                loading={isLoading}
                loadingLabel="Loading product..."
                type="button"
                className="btn-primary w-full"
              >
                Load Product
              </LoadingButton>
            </div>
          </div>
        )}

        {/* Product Details & Transfer Form */}
        {product && (
          <div className="space-y-8">
            {/* Current Product Info */}
            <div className="card">
              <h3 className="text-h3 font-sans mb-4">Current Product</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-fog">Product Name:</span>
                  <span className="font-medium">{product.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fog">Lot ID:</span>
                  <span className="font-mono">{product.lotId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fog">Current Custodian:</span>
                  <span className="font-mono text-signal">You</span>
                </div>
              </div>
            </div>

            {/* Custody History */}
            <div className="card">
              <h3 className="text-h3 font-sans mb-6">Custody History</h3>
              <CustodyTimeline history={product.custodyHistory} />
            </div>

            {/* Transfer Form */}
            <div className="card">
              <h3 className="text-h3 font-sans mb-6">Transfer Details</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor={newCustodianId} className="label">New Custodian Address</label>
                  <input
                    id={newCustodianId}
                    type="text"
                    placeholder="0x..."
                    value={newCustodian}
                    onChange={(e) => setNewCustodian(e.target.value)}
                    className="input-field font-mono"
                    aria-describedby={error ? 'transfer-error' : undefined}
                  />
                </div>
                <div>
                  <label htmlFor={locationId} className="label">Location</label>
                  <input
                    id={locationId}
                    type="text"
                    placeholder="Warehouse - Medellín"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field"
                    aria-describedby={error ? 'transfer-error' : undefined}
                  />
                </div>
                <LoadingButton
                  onClick={handleTransfer}
                  loading={isTransferring}
                  loadingLabel="Transferring custody..."
                  type="button"
                  className="btn-primary w-full"
                >
                  Confirm Transfer
                </LoadingButton>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
