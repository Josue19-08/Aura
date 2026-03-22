import { motion } from 'framer-motion'

export function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <span
      className={`inline-block ${sizes[size]} border-signal/20 border-t-signal rounded-full animate-spin`}
      aria-hidden="true"
    />
  )
}

export function LoadingButton({
  loading,
  loadingLabel = 'Processing...',
  children,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-busy={loading}
    >
      <span className="inline-flex items-center justify-center gap-3">
        {loading && <Spinner size="sm" />}
        <span>{loading ? loadingLabel : children}</span>
      </span>
    </button>
  )
}

function SkeletonBlock({ className }) {
  return <div className={`loading-skeleton rounded-lg ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="card space-y-4" aria-hidden="true">
      <SkeletonBlock className="h-5 w-3/4" />
      <SkeletonBlock className="h-4 w-1/2" />
      <SkeletonBlock className="h-4 w-5/6" />
    </div>
  )
}

export function SkeletonProductCard() {
  return (
    <div className="card" aria-hidden="true">
      <div className="flex gap-4 mb-6">
        <SkeletonBlock className="w-24 h-24" />
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-6 w-3/4" />
          <SkeletonBlock className="h-4 w-1/2" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-4/5" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="card" aria-hidden="true">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <SkeletonBlock className="h-4 w-1/4" />
            <SkeletonBlock className="h-4 w-1/3" />
            <SkeletonBlock className="h-4 w-1/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResultSkeleton() {
  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="card space-y-4">
        <SkeletonBlock className="h-16 w-16 mx-auto rounded-full" />
        <SkeletonBlock className="h-8 w-64 mx-auto" />
        <SkeletonBlock className="h-4 w-48 mx-auto" />
      </div>
      <div className="card space-y-3">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8" aria-live="polite" aria-busy="true">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <SkeletonBlock className="h-10 w-48" />
            <SkeletonBlock className="h-4 w-64" />
          </div>
          <SkeletonBlock className="h-10 w-28" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((item) => (
            <div key={item} className="card space-y-4">
              <SkeletonBlock className="h-6 w-8" />
              <SkeletonBlock className="h-8 w-24" />
              <SkeletonBlock className="h-4 w-28" />
            </div>
          ))}
        </div>
        <div className="card space-y-4">
          <SkeletonBlock className="h-6 w-52" />
          {[0, 1, 2, 3].map((item) => (
            <SkeletonBlock key={item} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TransactionPending({ txHash }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center gap-4">
        <Spinner />
        <div className="flex-1">
          <p className="text-white font-medium mb-1">Transaction Pending</p>
          <p className="text-fog text-sm">Waiting for blockchain confirmation...</p>
          {txHash && (
            <a
              href={`https://testnet.snowtrace.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal text-sm hover:underline inline-block mt-1"
            >
              View on Explorer
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function IPFSUploading({ progress }) {
  return (
    <div className="card">
      <div className="flex justify-between mb-2">
        <span className="text-white text-sm">Uploading to IPFS...</span>
        <span className="text-signal text-sm">{progress}%</span>
      </div>
      <div className="h-2 bg-slate rounded-full overflow-hidden">
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

export function GlobalLoader({ show }) {
  if (!show) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-white mt-4">Loading...</p>
      </div>
    </motion.div>
  )
}

export function LoadingOverlay({ show = true, label, message }) {
  if (!show) {
    return null
  }

  const content = label ?? message ?? 'Loading...'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] bg-void/75 backdrop-blur-sm flex items-center justify-center px-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="card text-center max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <Spinner size="lg" />
        </div>
        <p className="text-white font-medium">{content}</p>
        <p className="text-fog text-sm mt-2">Please wait while Aura finishes the request.</p>
      </div>
    </motion.div>
  )
}
