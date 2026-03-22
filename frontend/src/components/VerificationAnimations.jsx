import { motion } from 'framer-motion'

// Success Animation with Checkmark Reveal
export function VerificationSuccess({ product }) {
  // Particle effect positions
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 12
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-8 bg-signal/10 backdrop-blur-xl overflow-hidden"
    >
      {/* Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1.5 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0 bg-gradient-radial from-signal/20 to-transparent blur-3xl"
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: `calc(50% + ${Math.cos((particle.angle * Math.PI) / 180) * 100}px)`,
              y: `calc(50% + ${Math.sin((particle.angle * Math.PI) / 180) * 100}px)`
            }}
            transition={{
              duration: 1,
              delay: 0.3 + particle.id * 0.03,
              ease: 'easeOut'
            }}
            className="absolute w-2 h-2 bg-signal rounded-full"
            style={{ left: '50%', top: '50%' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative text-center">
        {/* Checkmark Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            delay: 0.2
          }}
          className="inline-block mb-6"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(0, 229, 204, 0.4)',
                '0 0 0 20px rgba(0, 229, 204, 0)',
                '0 0 0 0 rgba(0, 229, 204, 0)'
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-24 h-24 rounded-full bg-signal/20 flex items-center justify-center"
          >
            <span className="text-signal text-5xl">✓</span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-signal mb-2"
        >
          Verified Authentic
        </motion.h3>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-fog/80 mb-6"
        >
          <p className="text-lg">{product.productName}</p>
          <p className="text-sm">Lot ID: {product.lotId}</p>
        </motion.div>

        {/* Counter Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-block px-4 py-2 bg-slate/40 backdrop-blur-sm rounded"
        >
          <p className="text-sm text-fog/70">
            Verification #{' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white font-mono font-bold"
            >
              {product.verificationCount || 0}
            </motion.span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Failure Animation with Warning Icon
export function VerificationFailure({ error, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-8 bg-caution/10 backdrop-blur-xl overflow-hidden"
    >
      {/* Background Pulse */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 bg-gradient-radial from-caution/20 to-transparent blur-3xl"
      />

      {/* Content */}
      <div className="relative text-center">
        {/* Warning Icon with Shake */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            delay: 0.2
          }}
          className="inline-block mb-6"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0]
            }}
            transition={{
              duration: 0.5,
              delay: 0.5
            }}
            className="w-24 h-24 rounded-full bg-caution/20 flex items-center justify-center"
          >
            <span className="text-caution text-5xl">⚠️</span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-caution mb-2"
        >
          Verification Failed
        </motion.h3>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-fog/80 mb-6"
        >
          {error || 'Unable to verify this product'}
        </motion.p>

        {/* Retry Button */}
        {onRetry && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="px-6 py-3 bg-caution/10 hover:bg-caution/20 transition-colors duration-300"
          >
            <span className="text-caution font-medium">Try Again</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

// QR Code Scan Animation
export function ScanAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-64 h-64 mx-auto"
    >
      {/* QR Code Frame */}
      <div className="absolute inset-0 border-2 border-signal/30">
        {/* Corner Brackets */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
          <motion.div
            key={corner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`absolute w-8 h-8 border-signal ${
              corner.includes('top') ? 'border-t-2' : 'border-b-2'
            } ${corner.includes('left') ? 'border-l-2 left-0' : 'border-r-2 right-0'} ${
              corner.includes('top') ? 'top-0' : 'bottom-0'
            }`}
          />
        ))}
      </div>

      {/* Scanning Line */}
      <motion.div
        animate={{ y: ['0%', '100%', '0%'] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute left-0 right-0 h-1 bg-signal shadow-lg"
        style={{
          boxShadow: '0 0 20px rgba(0, 229, 204, 0.8)'
        }}
      />

      {/* Scanning Text */}
      <motion.p
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -bottom-12 left-0 right-0 text-center text-signal text-sm"
      >
        Scanning QR Code...
      </motion.p>
    </motion.div>
  )
}

// Product Card Reveal Animation
export function ProductReveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Counter Animation Component
export function AnimatedCounter({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      {value}
    </motion.span>
  )
}
