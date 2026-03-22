import { animate, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CustodyTimeline from './CustodyTimeline'

export default function VerificationResult({ result }) {
  const reduceMotion = useReducedMotion()
  const { status, product, custodyHistory, verificationCount } = result

  const getStatusConfig = () => {
    switch (status) {
      case 'authentic':
        return {
          icon: '✓',
          title: 'AUTHENTIC PRODUCT',
          bgClass: 'bg-signal/20',
          borderClass: 'border-signal',
          textClass: 'text-signal',
          iconBg: 'bg-signal',
        }
      case 'suspicious':
        return {
          icon: '⚠',
          title: 'SUSPICIOUS PRODUCT',
          bgClass: 'bg-caution/20',
          borderClass: 'border-caution',
          textClass: 'text-caution',
          iconBg: 'bg-caution',
        }
      case 'not_found':
      default:
        return {
          icon: '✕',
          title: 'PRODUCT NOT FOUND',
          bgClass: 'bg-fog/20',
          borderClass: 'border-fog',
          textClass: 'text-fog',
          iconBg: 'bg-fog',
        }
    }
  }

  const statusConfig = getStatusConfig()

  if (status === 'not_found') {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${statusConfig.bgClass} ${statusConfig.borderClass} border-2 rounded-lg p-8`}
      >
        <div className="text-center">
          <div className={`${statusConfig.iconBg} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
            <span className="text-4xl text-void">{statusConfig.icon}</span>
          </div>
          <h2 className={`text-h2 font-display ${statusConfig.textClass} mb-4`}>
            {statusConfig.title}
          </h2>
          <p className="text-fog mb-6">
            This product ID is not registered in the Aura system.
          </p>
          <div className="bg-void rounded-lg p-6 text-left">
            <h3 className="font-semibold mb-3">Possible causes:</h3>
            <ul className="space-y-2 text-fog">
              <li>• Product is counterfeit</li>
              <li>• QR code is damaged or incorrect</li>
              <li>• Product has not been registered yet</li>
            </ul>
          </div>
          <p className={`${statusConfig.textClass} font-semibold mt-6`}>
            Do not use this product until verified.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Status Header */}
      <div className={`${statusConfig.bgClass} ${statusConfig.borderClass} border-2 rounded-lg p-8 text-center`}>
        <motion.div
          initial={reduceMotion ? false : { scale: 0.7, rotate: status === 'authentic' ? -12 : 0 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4 }}
          className={`${statusConfig.iconBg} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}
        >
          <span className="text-4xl text-void">{statusConfig.icon}</span>
        </motion.div>
        <h2 className={`text-h2 font-display ${statusConfig.textClass} mb-2`}>
          {statusConfig.title}
        </h2>
        {status === 'suspicious' && (
          <p className={`${statusConfig.textClass} font-medium`}>
            Unusually high verification count detected
          </p>
        )}
      </div>

      {/* Product Details */}
      <div className="card">
        <h3 className="text-h3 font-sans mb-6">Product Information</h3>
        <div className="space-y-4">
          <DetailRow label="Product Name" value={product.productName} />
          <DetailRow label="Lot ID" value={product.lotId} mono />
          <DetailRow label="Origin" value={product.origin} />
          <DetailRow
            label="Manufacturer"
            value={`${product.manufacturer.slice(0, 6)}...${product.manufacturer.slice(-4)}`}
            mono
          />
          <DetailRow
            label="Registered"
            value={new Date(product.createdAt * 1000).toLocaleDateString()}
          />
          <DetailRow
            label="Verification Count"
            value={<AnimatedCounter value={verificationCount} />}
            highlight={verificationCount > 100}
          />
        </div>

        {product.ipfsHash && (
          <div className="mt-6 pt-6 border-t border-fog/20">
            <a
              href={`${import.meta.env.VITE_IPFS_GATEWAY}${product.ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full text-center block"
            >
              View Certificates on IPFS
            </a>
          </div>
        )}
      </div>

      {/* Custody History */}
      {custodyHistory && custodyHistory.length > 0 && (
        <div className="card">
          <h3 className="text-h3 font-sans mb-6">Custody History</h3>
          <CustodyTimeline history={custodyHistory} />
        </div>
      )}

      {/* Warning for Suspicious Products */}
      {status === 'suspicious' && (
        <div className="bg-caution/20 border border-caution rounded-lg p-6">
          <h3 className="text-caution font-semibold mb-3">⚠ WARNING</h3>
          <p className="text-fog mb-4">
            This product has been verified {verificationCount} times, which is unusually
            high for a pharmaceutical product.
          </p>
          <div className="bg-void rounded-lg p-4">
            <h4 className="font-semibold mb-2">Possible causes:</h4>
            <ul className="space-y-2 text-fog text-sm">
              <li>• QR code has been copied and distributed</li>
              <li>• Product may be counterfeit with cloned identifier</li>
            </ul>
          </div>
          <p className="text-caution font-semibold mt-4">
            Contact manufacturer before using this product.
          </p>
        </div>
      )}
    </motion.div>
  )
}

function DetailRow({ label, value, mono = false, highlight = false }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-fog">{label}</span>
      <span className={`${mono ? 'font-mono' : 'font-medium'} ${highlight ? 'text-caution' : ''}`}>
        {value}
      </span>
    </div>
  )
}

function AnimatedCounter({ value }) {
  const reduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value)
      return
    }

    const controls = animate(0, value, {
      duration: 0.6,
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })

    return () => controls.stop()
  }, [reduceMotion, value])

  return displayValue.toLocaleString()
}
