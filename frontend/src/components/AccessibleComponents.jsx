import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Skip to Main Content Link
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Skip to main content
    </a>
  )
}

// Accessible Button with proper ARIA attributes
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      className={`touch-target ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Accessible Input with Label and Error
export function AccessibleInput({
  id,
  label,
  error,
  required = false,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="label"
      >
        {label}
        {required && <span className="text-caution ml-1" aria-label="required">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className="input-field"
        {...props}
      />
      {error && (
        <p
          id={errorId}
          className="text-caution text-sm mt-1"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// Focus Trap for Modals
export function FocusTrap({ children, active = true }) {
  const containerRef = useRef(null)
  const firstFocusableRef = useRef(null)
  const lastFocusableRef = useRef(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    firstFocusableRef.current = focusableElements[0]
    lastFocusableRef.current = focusableElements[focusableElements.length - 1]

    // Focus first element
    firstFocusableRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault()
          lastFocusableRef.current?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault()
          firstFocusableRef.current?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active])

  return <div ref={containerRef}>{children}</div>
}

// Live Region for Dynamic Updates
export function LiveRegion({ children, politeness = 'polite' }) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  )
}

// Accessible Modal
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  closeOnEscape = true,
  closeOnOverlayClick = true
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnEscape])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <FocusTrap active={isOpen}>
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-slate/40 backdrop-blur-xl p-8 max-w-2xl w-full mx-4"
          role="document"
        >
          <h2
            id="modal-title"
            className="text-2xl font-bold text-white mb-4"
          >
            {title}
          </h2>

          {children}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-fog hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      </FocusTrap>
    </div>
  )
}

// Keyboard Shortcuts Display
export function KeyboardShortcuts() {
  const shortcuts = [
    { key: 'Tab', action: 'Navigate forward' },
    { key: 'Shift + Tab', action: 'Navigate backward' },
    { key: 'Enter', action: 'Activate button/link' },
    { key: 'Space', action: 'Activate button' },
    { key: 'Esc', action: 'Close modal/dialog' },
    { key: '/', action: 'Focus search' }
  ]

  return (
    <div className="p-6 bg-slate/40 backdrop-blur-xl">
      <h3 className="text-xl font-bold text-white mb-4">
        Keyboard Shortcuts
      </h3>
      <dl className="space-y-2">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.key} className="flex justify-between">
            <dt className="text-fog/80">
              <kbd className="px-2 py-1 bg-void/50 rounded text-signal font-mono text-sm">
                {shortcut.key}
              </kbd>
            </dt>
            <dd className="text-white ml-4">{shortcut.action}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// Visually Hidden (for screen readers only)
export function VisuallyHidden({ children }) {
  return <span className="sr-only">{children}</span>
}
