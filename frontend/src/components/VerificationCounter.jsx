import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function VerificationCounter({
  verificationCount,
  createdAt,
  productId
}) {
  const [alertLevel, setAlertLevel] = useState('safe')
  const [alertMessage, setAlertMessage] = useState('')
  const [stats, setStats] = useState({})

  useEffect(() => {
    analyzeVerificationPattern()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationCount, createdAt])

  const analyzeVerificationPattern = () => {
    const productAge = Date.now() - createdAt * 1000
    const daysOld = Math.max(productAge / (1000 * 60 * 60 * 24), 0.1) // Prevent division by zero
    const verificationsPerDay = verificationCount / daysOld

    setStats({
      daysOld: Math.floor(daysOld),
      verificationsPerDay: verificationsPerDay.toFixed(2)
    })

    // Alert thresholds
    if (verificationsPerDay > 100) {
      setAlertLevel('critical')
      setAlertMessage('⚠️ CRITICAL: Extremely high verification rate detected. This product may be counterfeit.')
    } else if (verificationsPerDay > 50) {
      setAlertLevel('warning')
      setAlertMessage('⚠️ WARNING: Unusually high verification rate. Verify with manufacturer.')
    } else if (verificationCount > 1000) {
      setAlertLevel('info')
      setAlertMessage('ℹ️ INFO: Product has been verified many times. Popular product.')
    } else {
      setAlertLevel('safe')
      setAlertMessage('✓ Normal verification pattern')
    }
  }

  const getAlertColor = () => {
    switch (alertLevel) {
      case 'critical':
        return 'text-caution'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-400'
      default:
        return 'text-signal'
    }
  }

  const getAlertBg = () => {
    switch (alertLevel) {
      case 'critical':
        return 'bg-caution/10'
      case 'warning':
        return 'bg-yellow-500/10'
      case 'info':
        return 'bg-blue-400/10'
      default:
        return 'bg-signal/10'
    }
  }

  const getHealthScore = () => {
    const rate = parseFloat(stats.verificationsPerDay)
    if (rate > 100) return { score: 0, label: 'Critical' }
    if (rate > 50) return { score: 40, label: 'Warning' }
    if (rate > 20) return { score: 70, label: 'Moderate' }
    return { score: 100, label: 'Healthy' }
  }

  const health = getHealthScore()
  const alertColor = getAlertColor()

  return (
    <div className="space-y-4">
      {/* Verification Count Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="p-6 bg-slate/40 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-fog/70 text-sm uppercase tracking-wider mb-1">
              Verification Count
            </p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-mono font-bold text-white"
            >
              {verificationCount.toLocaleString()}
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className={`text-5xl ${alertColor}`}
          >
            {alertLevel === 'critical' ? '🚨' :
             alertLevel === 'warning' ? '⚠️' :
             alertLevel === 'info' ? 'ℹ️' : '✓'}
          </motion.div>
        </div>

        {/* Health Score */}
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-fog/70 text-sm">Health Score</span>
            <span className={`${alertColor} font-medium`}>
              {health.score}/100
            </span>
          </div>
          <div className="h-2 bg-slate/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${health.score}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full ${alertColor.replace('text-', 'bg-')}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Alert Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-4 ${getAlertBg()} backdrop-blur-sm`}
      >
        <p className={`${alertColor} font-medium mb-2`}>
          {alertMessage}
        </p>

        {alertLevel !== 'safe' && (
          <div className="mt-3 text-fog/80 text-sm space-y-1">
            <p>• Product Age: {stats.daysOld} days</p>
            <p>• Avg Verifications/Day: {stats.verificationsPerDay}</p>
            <p>• Status: {health.label}</p>
          </div>
        )}
      </motion.div>

      {/* Critical Alert - Fraud Prevention Tips */}
      {alertLevel === 'critical' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-caution/5 border border-caution/20"
        >
          <h4 className="text-caution font-bold mb-2 flex items-center gap-2">
            <span>🛡️</span>
            <span>What to do:</span>
          </h4>
          <ul className="text-fog/80 text-sm space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-caution">•</span>
              <span>Do not use this product</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-caution">•</span>
              <span>Contact the manufacturer directly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-caution">•</span>
              <span>Report this product ID: <span className="font-mono">{productId}</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-caution">•</span>
              <span>Request a refund from seller</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-caution">•</span>
              <span>Verify purchase location</span>
            </li>
          </ul>
        </motion.div>
      )}

      {/* Verification Analytics */}
      {(alertLevel === 'warning' || alertLevel === 'info') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-slate/40 backdrop-blur-xl"
        >
          <h4 className="text-white font-bold mb-3">Verification Analytics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-fog/60 mb-1">Verification Rate</p>
              <p className="text-white font-mono">{stats.verificationsPerDay}/day</p>
            </div>
            <div>
              <p className="text-fog/60 mb-1">Status</p>
              <p className={alertColor}>{health.label}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
