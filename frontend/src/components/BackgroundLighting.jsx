import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

export default function BackgroundLighting() {
  // Mouse spotlight tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 150 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* FIXED Background - Always visible */}
      <div className="fixed inset-0 z-0 bg-[#0A0A0F]" />

      {/* Mouse Spotlight Effect */}
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-5"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 204, 0.08) 0%, rgba(0, 229, 204, 0.04) 30%, transparent 60%)',
            filter: 'blur(40px)'
          }}
        />
      </motion.div>

      {/* FIXED Sunrise Light - ALWAYS VISIBLE */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {/* Main radial glow covering 1/4 of page from bottom right */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(circle at 85% 85%, rgba(0, 229, 204, 0.25) 0%, rgba(0, 229, 204, 0.18) 15%, rgba(0, 229, 204, 0.12) 25%, rgba(0, 229, 204, 0.06) 35%, rgba(0, 229, 204, 0.03) 45%, transparent 60%)',
            filter: 'blur(40px)'
          }}
        />

        {/* Secondary layer for depth */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.15, 0.7, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{
            background: 'radial-gradient(ellipse 80% 90% at 88% 88%, rgba(0, 229, 204, 0.22) 0%, rgba(0, 229, 204, 0.15) 18%, rgba(0, 229, 204, 0.09) 30%, rgba(0, 229, 204, 0.04) 42%, transparent 65%)',
            filter: 'blur(50px)'
          }}
        />

        {/* Deformed organic layer */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.2, 0.75, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            background: 'radial-gradient(ellipse 70% 95% at 90% 82%, rgba(0, 229, 204, 0.2) 0%, rgba(0, 229, 204, 0.12) 20%, rgba(0, 229, 204, 0.06) 35%, rgba(0, 229, 204, 0.02) 50%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />

        {/* Concentrated bottom-right glow */}
        <motion.div
          className="absolute bottom-0 right-0 w-[50vw] h-[50vh]"
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 75% 75%, rgba(0, 229, 204, 0.28) 0%, rgba(0, 229, 204, 0.16) 25%, rgba(0, 229, 204, 0.08) 45%, transparent 75%)',
            filter: 'blur(35px)'
          }}
        />
      </div>
    </>
  )
}
