import { motion, useReducedMotion } from 'framer-motion'

export default function CustodyTimeline({ history }) {
  const reduceMotion = useReducedMotion()

  if (!history || history.length === 0) {
    return <p className="text-fog">No custody history available</p>
  }

  return (
    <div className="space-y-6">
      {history.map((record, index) => (
        <motion.div
          key={index}
          initial={reduceMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
          className="relative pl-8"
        >
          {/* Timeline Line */}
          {index < history.length - 1 && (
            <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-signal/30" />
          )}

          {/* Timeline Dot */}
          <div
            className={`absolute left-0 top-1 w-4 h-4 rounded-full ${
              index === history.length - 1
                ? 'bg-signal glow-signal'
                : 'bg-fog'
            }`}
          />

          {/* Content */}
          <div className="bg-void rounded-lg p-4 border border-fog/20 hover:border-signal/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <span className="text-fog text-sm">
                {formatDate(record.timestamp)}
              </span>
              {index === history.length - 1 && (
                <span className="text-signal text-xs font-semibold bg-signal/20 px-2 py-1 rounded">
                  CURRENT
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-fog text-sm">Custodian</span>
                <p className="font-mono text-sm">
                  {formatAddress(record.custodian)}
                </p>
              </div>

              {record.locationNote && (
                <div>
                  <span className="text-fog text-sm">Location</span>
                  <p className="font-medium">{record.locationNote}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function formatDate(timestamp) {
  const date = new Date(
    typeof timestamp === 'number' && timestamp < 10000000000
      ? timestamp * 1000
      : timestamp
  )

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
