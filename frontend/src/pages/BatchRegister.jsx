import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import WalletConnect from '@components/WalletConnect'
import BatchUpload from '@components/BatchUpload'
import { registerProductsBatch, exportResultsCSV } from '@utils/batchRegister'

function ProgressBar({ progress }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-fog">Registering products on-chain...</span>
        <span className="text-signal font-mono">
          {progress.current}/{progress.total}
        </span>
      </div>
      <div className="h-2 bg-slate rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentage}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-signal rounded-full"
        />
      </div>
      <div className="flex gap-4 text-sm">
        <span className="text-signal">✓ {progress.successCount} succeeded</span>
        {progress.failCount > 0 && (
          <span className="text-caution">✗ {progress.failCount} failed</span>
        )}
      </div>
    </div>
  )
}

export default function BatchRegister() {
  const { isConnected } = useAccount()

  const [parsedProducts, setParsedProducts] = useState([])
  const [parseErrors, setParseErrors] = useState([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [progress, setProgress] = useState(null)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleProductsParsed = (products, errors) => {
    setParsedProducts(products)
    setParseErrors(errors)
    setResults(null)
    setError(null)
  }

  const handleRegister = async () => {
    if (parsedProducts.length === 0) return
    setIsRegistering(true)
    setError(null)
    setResults(null)
    setProgress({ current: 0, total: parsedProducts.length, successCount: 0, failCount: 0, percentage: 0 })

    try {
      const batchResults = await registerProductsBatch(parsedProducts, setProgress)
      setResults(batchResults)
    } catch (err) {
      setError(err.message || 'Batch registration failed')
    } finally {
      setIsRegistering(false)
    }
  }

  const handleExportResults = () => {
    if (!results) return
    const csv = exportResultsCSV(results.results)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'aura-batch-results.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setParsedProducts([])
    setParseErrors([])
    setProgress(null)
    setResults(null)
    setError(null)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h1 className="text-h1 font-display mb-6">Batch Register</h1>
          <p className="text-fog mb-8">Connect your wallet to register products in bulk</p>
          <div className="card inline-block">
            <WalletConnect />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-h1 font-display mb-2 text-center">Batch Register</h1>
          <p className="text-fog text-center">
            Upload a CSV file to register multiple products at once
          </p>
        </div>

        {error && (
          <div className="bg-caution/20 border border-caution text-caution rounded-lg p-4">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Results view */}
          {results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card space-y-6"
            >
              <div className="text-center">
                <div className={`text-5xl mb-3 ${results.failCount === 0 ? '' : ''}`}>
                  {results.failCount === 0 ? '✅' : '⚠️'}
                </div>
                <h2 className="text-h3 font-display mb-1">
                  Batch Complete
                </h2>
                <p className="text-fog">
                  <span className="text-signal font-bold">{results.successCount}</span> registered,{' '}
                  <span className={results.failCount > 0 ? 'text-caution font-bold' : 'text-fog'}>
                    {results.failCount}
                  </span> failed
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={handleExportResults} className="btn-secondary">
                  Export Results CSV
                </button>
                <button onClick={handleReset} className="btn-outline">
                  Register Another Batch
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" className="card space-y-6">
              {/* Upload */}
              <div>
                <h2 className="text-h3 font-display mb-4">Upload CSV</h2>
                <BatchUpload onProductsParsed={handleProductsParsed} />
              </div>

              {/* Preview */}
              {parsedProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-fog/10 pt-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-signal font-medium">
                      ✓ {parsedProducts.length} product{parsedProducts.length > 1 ? 's' : ''} ready
                      {parseErrors.length > 0 && (
                        <span className="text-caution ml-2">({parseErrors.length} rows skipped)</span>
                      )}
                    </p>
                  </div>

                  {/* Preview table (first 5) */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-fog/10 text-fog">
                          <th className="text-left py-2 pr-3 font-medium">Lot ID</th>
                          <th className="text-left py-2 pr-3 font-medium">Product</th>
                          <th className="text-left py-2 font-medium">Origin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedProducts.slice(0, 5).map((p, i) => (
                          <tr key={i} className="border-b border-fog/5 text-fog/80">
                            <td className="py-2 pr-3 font-mono">{p.lotId}</td>
                            <td className="py-2 pr-3">{p.productName}</td>
                            <td className="py-2">{p.origin}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedProducts.length > 5 && (
                      <p className="text-fog/50 text-xs mt-2">
                        …and {parsedProducts.length - 5} more
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Progress */}
              {isRegistering && progress && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-fog/10 pt-6"
                >
                  <ProgressBar progress={progress} />
                </motion.div>
              )}

              {/* Register button */}
              <button
                onClick={handleRegister}
                disabled={parsedProducts.length === 0 || isRegistering}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering
                  ? `Registering… (${progress?.current || 0}/${progress?.total || 0})`
                  : `Register ${parsedProducts.length || 0} Product${parsedProducts.length !== 1 ? 's' : ''}`}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
