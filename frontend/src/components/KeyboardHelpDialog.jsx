import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { keys: '?', description: 'Open keyboard help' },
  { keys: 'Esc', description: 'Close dialogs and overlays' },
  { keys: 'Tab / Shift+Tab', description: 'Move through interactive controls' },
  { keys: 'Enter / Space', description: 'Activate focused controls' },
]

export default function KeyboardHelpDialog({ open, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open || !dialogRef.current) {
      return
    }

    const dialogNode = dialogRef.current
    const focusable = dialogNode.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    first?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }

      if (event.key === 'Tab' && first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    dialogNode.addEventListener('keydown', handleKeyDown)
    return () => dialogNode.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] bg-void/80 backdrop-blur-sm flex items-center justify-center px-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-help-title"
        className="card max-w-lg w-full"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 id="keyboard-help-title" className="text-h3 font-display">
              Keyboard Help
            </h2>
            <p className="text-fog text-sm mt-2">
              Aura supports keyboard navigation across verification, registration, transfer, and analytics flows.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-outline px-4 py-2">
            Close
          </button>
        </div>

        <ul className="space-y-3">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.keys} className="flex items-center justify-between gap-6 border-b border-fog/10 pb-3">
              <span className="font-mono text-signal">{shortcut.keys}</span>
              <span className="text-fog text-right">{shortcut.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
