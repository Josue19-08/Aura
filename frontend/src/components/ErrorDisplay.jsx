import { motion } from 'framer-motion'
import { getErrorMessage } from '../utils/errorMessages'

export function FieldError({ error }) {
  if (!error) return null

  return (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-caution text-sm mt-1"
    >
      {error}
    </motion.p>
  )
}

export function FormError({ error }) {
  if (!error) return null

  const errorMsg = getErrorMessage(error)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-caution/10 backdrop-blur-xl mb-6"
    >
      <div className="flex gap-3">
        <span className="text-caution text-xl">⚠️</span>
        <div className="flex-1">
          <h4 className="text-caution font-bold mb-1">
            {errorMsg.title}
          </h4>
          <p className="text-fog/80 text-sm mb-2">
            {errorMsg.message}
          </p>
          <p className="text-signal text-sm">
            → {errorMsg.action}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function SuccessMessage({ title, message, txHash, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-signal/10 backdrop-blur-xl mb-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
          ✓
        </motion.div>
        <h3 className="text-2xl font-bold text-signal mb-2">
          {title}
        </h3>
        <p className="text-fog/80 mb-4">
          {message}
        </p>
        {txHash && (
          <a
            href={`https://testnet.snowtrace.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal hover:underline text-sm inline-block mb-4"
          >
            View Transaction →
          </a>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2 bg-signal/10 hover:bg-signal/20 transition-colors duration-300"
          >
            <span className="text-signal font-medium">Close</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

export function AlertBanner({ type = 'info', title, message, action, onAction }) {
  const getColors = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-caution/10',
          text: 'text-caution',
          icon: '⚠️'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-500',
          icon: '⚠️'
        }
      case 'success':
        return {
          bg: 'bg-signal/10',
          text: 'text-signal',
          icon: '✓'
        }
      default:
        return {
          bg: 'bg-blue-400/10',
          text: 'text-blue-400',
          icon: 'ℹ️'
        }
    }
  }

  const colors = getColors()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 ${colors.bg} backdrop-blur-xl mb-6`}
    >
      <div className="flex gap-3 items-start">
        <span className={`${colors.text} text-xl`}>{colors.icon}</span>
        <div className="flex-1">
          {title && (
            <h4 className={`${colors.text} font-bold mb-1`}>
              {title}
            </h4>
          )}
          <p className="text-fog/80 text-sm">
            {message}
          </p>
          {action && onAction && (
            <button
              onClick={onAction}
              className={`mt-2 ${colors.text} hover:underline text-sm font-medium`}
            >
              {action} →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
