import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Home() {
  const reduceMotion = useReducedMotion()

  return (
    <div>
      <section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={reduceMotion ? undefined : { rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="text-signal text-5xl md:text-6xl flex-shrink-0"
                >
                  ✦
                </motion.div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.05] tracking-tight">
                  <span className="text-white">IMMUTABLE</span>
                  <br />
                  <span className="text-white">PRODUCT</span>
                  <br />
                  <span className="text-signal">TRACEABILITY</span>
                </h1>
              </div>
            </div>

            <p className="text-lg md:text-xl text-fog/90 leading-relaxed max-w-2xl">
              Giving pharmaceutical companies a competitive edge through blockchain-powered authenticity verification
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link to="/verify">
                <motion.div
                  whileHover={reduceMotion ? undefined : { x: 5 }}
                  className="inline-flex items-center gap-4 group"
                >
                  <div className="px-8 py-4 bg-signal/10 hover:bg-signal/20 transition-colors duration-300 backdrop-blur-sm">
                    <span className="text-signal font-medium text-lg uppercase tracking-wider">
                      Verify Product
                    </span>
                  </div>
                  <motion.div
                    animate={reduceMotion ? { x: 0 } : { x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-signal text-3xl"
                  >
                    →
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="<1s" label="Verification Time" delay={0} />
            <StatItem value="100%" label="Immutable" delay={0.1} />
            <StatItem value="∞" label="Traceability" delay={0.2} />
            <StatItem value="24/7" label="Available" delay={0.3} />
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              <span className="text-white">BUILT FOR</span>{' '}
              <span className="text-signal">TRUST</span>
            </h2>
            <p className="text-xl text-fog/80 max-w-2xl">
              Enterprise-grade blockchain security meets instant verification
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="⚡"
              title="Instant Verification"
              description="Scan and verify in under 1 second. No registration required."
              delay={0}
            />
            <FeatureCard
              icon="🔗"
              title="Complete Chain"
              description="Track every step from manufacturer to consumer."
              delay={0.1}
            />
            <FeatureCard
              icon="🔒"
              title="Military Security"
              description="Cryptographic proof prevents any tampering."
              delay={0.2}
            />
            <FeatureCard
              icon="📊"
              title="Real-time Analytics"
              description="Monitor patterns and detect anomalies instantly."
              delay={0.3}
            />
            <FeatureCard
              icon="🌐"
              title="Global Access"
              description="Verify from anywhere, on any device."
              delay={0.4}
            />
            <FeatureCard
              icon="⚙️"
              title="Easy Integration"
              description="Simple API for seamless platform integration."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-12 md:p-20 backdrop-blur-xl"
            style={{
              background: 'rgba(0, 229, 204, 0.05)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-signal/10 to-transparent" />
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                <span className="text-white">READY TO</span>{' '}
                <span className="text-signal">START?</span>
              </h2>
              <p className="text-xl text-fog/80 mb-8">
                Join leading pharmaceutical companies in the fight against counterfeits
              </p>
              <Link to="/verify">
                <motion.div
                  whileHover={reduceMotion ? undefined : { x: 5 }}
                  className="inline-flex items-center gap-4 group"
                >
                  <div className="px-8 py-4 bg-signal/10 hover:bg-signal/20 transition-colors duration-300 backdrop-blur-sm">
                    <span className="text-signal font-medium text-lg uppercase tracking-wider">
                      Verify Now
                    </span>
                  </div>
                  <motion.div
                    animate={reduceMotion ? { x: 0 } : { x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-signal text-3xl"
                  >
                    →
                  </motion.div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function StatItem({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="text-center md:text-left"
    >
      <div className="text-3xl md:text-4xl font-mono font-bold text-signal mb-1">
        {value}
      </div>
      <div className="text-sm text-fog/70 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  )
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="relative p-8 hover:bg-white/[0.02] transition-all duration-300 group backdrop-blur-sm"
      style={{
        background: 'rgba(255, 255, 255, 0.01)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-signal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-fog/80 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
