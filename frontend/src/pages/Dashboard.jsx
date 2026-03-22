import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getStats } from '@utils/api'
import { ErrorMessage } from '@components/FeedbackMessage'
import { DashboardSkeleton } from '@components/LoadingStates'

function StatCard({ title, value, icon, highlight }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {highlight && (
          <span className="text-xs font-medium text-caution bg-caution/10 px-2 py-1 rounded-full">
            Alert
          </span>
        )}
      </div>
      <div>
        <div className="text-3xl font-mono font-bold text-white">
          {value !== null && value !== undefined ? value.toLocaleString() : '—'}
        </div>
        <div className="text-fog text-sm uppercase tracking-wider mt-1">{title}</div>
      </div>
    </motion.div>
  )
}

function TopProductsTable({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-fog/60 text-center py-8">No products registered yet.</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fog/10">
            <th className="text-left text-fog font-medium py-3 pr-4">#</th>
            <th className="text-left text-fog font-medium py-3 pr-4">Product</th>
            <th className="text-left text-fog font-medium py-3 pr-4">Lot ID</th>
            <th className="text-right text-fog font-medium py-3">Verifications</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <tr key={product.id} className="border-b border-fog/5 hover:bg-fog/5 transition-colors">
              <td className="py-3 pr-4 text-fog/60 font-mono">{i + 1}</td>
              <td className="py-3 pr-4 text-white font-medium">{product.productName}</td>
              <td className="py-3 pr-4 font-mono text-fog">{product.lotId}</td>
              <td className="py-3 text-right">
                <span className={`font-mono font-bold ${product.verificationCount > 100 ? 'text-caution' : 'text-signal'}`}>
                  {product.verificationCount.toLocaleString()}
                </span>
                {product.verificationCount > 100 && (
                  <span className="ml-2 text-caution text-xs">⚠</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getStats()
      setStats(response)
    } catch (err) {
      setError(err.message || 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto text-center"
        >
          <ErrorMessage error={error} />
          <button onClick={fetchStats} type="button" className="btn-outline mt-6">
            Retry
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
        className="max-w-5xl mx-auto space-y-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-display mb-2">Analytics</h1>
            <p className="text-fog">Platform-wide traceability statistics</p>
          </div>
          <button
            onClick={fetchStats}
            className="btn-outline text-sm px-4 py-2"
          >
            Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Products"
            value={stats?.totalProducts}
            icon="📦"
          />
          <StatCard
            title="Total Verifications"
            value={stats?.totalVerifications}
            icon="✓"
          />
          <StatCard
            title="Fraud Alerts"
            value={stats?.fraudAlerts}
            icon="🚨"
            highlight={stats?.fraudAlerts > 0}
          />
        </div>

        {/* Top Products */}
        <div className="card">
          <h2 className="text-h3 font-display mb-6">Most Verified Products</h2>
          <TopProductsTable products={stats?.topProducts} />
        </div>

        {/* Fraud alert notice */}
        {stats?.fraudAlerts > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-caution/10 border border-caution/30 rounded-lg p-4 flex items-start gap-3"
          >
            <span className="text-caution text-xl mt-0.5">⚠</span>
            <div>
              <p className="text-caution font-semibold">
                {stats.fraudAlerts} product{stats.fraudAlerts > 1 ? 's' : ''} flagged for suspicious activity
              </p>
              <p className="text-fog text-sm mt-1">
                Products with more than 100 verifications may indicate counterfeit scanning attempts.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
