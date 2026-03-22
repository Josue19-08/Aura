import { motion } from 'framer-motion'
import { getErrorDetails } from '@utils/errorMessages'

export function ErrorMessage({ error, id }) {
  if (!error) {
    return null
  }

  const details = typeof error === 'string' ? { title: 'Error', message: error, action: null } : getErrorDetails(error)

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      aria-live="polite"
      className="bg-caution/20 border border-caution text-caution rounded-lg p-4"
    >
      <p className="font-semibold mb-1">{details.title}</p>
      <p className="text-sm text-white">{details.message}</p>
      {details.action && (
        <p className="text-sm mt-2 text-fog">{details.action}</p>
      )}
    </motion.div>
  )
}

export function SuccessMessage({ title, message, linkHref, linkLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-signal/15 border border-signal/30 rounded-lg p-6"
    >
      <p className="text-signal font-semibold mb-1">{title}</p>
      <p className="text-white">{message}</p>
      {linkHref && linkLabel && (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-signal hover:underline"
        >
          {linkLabel}
        </a>
      )}
    </motion.div>
  )
}
