import { motion } from 'framer-motion'

export function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]'
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} border-signal/20 border-t-signal rounded-full`}
      aria-label="Loading"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="p-6 bg-slate/40 backdrop-blur-xl animate-pulse">
      <div className="h-4 bg-slate/60 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-slate/60 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate/60 rounded w-5/6"></div>
    </div>
  )
}

export function SkeletonProductCard() {
  return (
    <div className="p-8 bg-slate/40 backdrop-blur-xl">
      <div className="flex gap-4 mb-6">
        <div className="w-24 h-24 bg-slate/60 rounded animate-pulse"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-slate/60 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-slate/60 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-slate/60 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 bg-slate/60 rounded animate-pulse"></div>
        <div className="h-3 bg-slate/60 rounded animate-pulse"></div>
        <div className="h-3 bg-slate/60 rounded w-4/5 animate-pulse"></div>
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-slate/40 backdrop-blur-xl p-6">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-slate/60 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-slate/60 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-slate/60 rounded w-1/5 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TransactionPending({ txHash }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-blue-500/10 backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <Spinner />
        <div className="flex-1">
          <p className="text-white font-medium mb-1">
            Transaction Pending
          </p>
          <p className="text-fog/70 text-sm">
            Waiting for blockchain confirmation...
          </p>
          {txHash && (
            <a
              href={`https://testnet.snowtrace.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal text-sm hover:underline inline-block mt-1"
            >
              View on Explorer →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function IPFSUploading({ progress }) {
  return (
    <div className="p-4 bg-signal/10 backdrop-blur-xl">
      <div className="flex justify-between mb-2">
        <span className="text-white text-sm">Uploading to IPFS...</span>
        <span className="text-signal text-sm">{progress}%</span>
      </div>
      <div className="h-2 bg-slate/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-signal"
        />
      </div>
    </div>
  )
}

export function LoadingButton({
  loading,
  children,
  disabled,
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-6 py-3 bg-signal/10 hover:bg-signal/20
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-300 ${className}`}
      {...props}
    >
      <span className="flex items-center justify-center gap-3">
        {loading && <Spinner size="sm" />}
        <span className="text-signal font-medium">
          {loading ? 'Processing...' : children}
        </span>
      </span>
    </button>
  )
}

export function GlobalLoader({ show }) {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50
        flex items-center justify-center"
    >
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-white mt-4">Loading...</p>
      </div>
    </motion.div>
  )
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-void/60 backdrop-blur-sm
        flex items-center justify-center z-10"
    >
      <div className="text-center p-6 bg-slate/40 backdrop-blur-xl">
        <Spinner size="lg" />
        <p className="text-white mt-4">{message}</p>
      </div>
    </motion.div>
  )
}
