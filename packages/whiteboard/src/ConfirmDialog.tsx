
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Check, X } from './icons'

interface Props {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  /** Label shown on the confirm button while `loading` is true. Defaults to `${confirmLabel}…`. */
  loadingLabel?: string
  loading?: boolean
  error?: string | null
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  loadingLabel,
  loading,
  error,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="confirm-modal-overlay" onMouseDown={onCancel}>
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal__header">
          <span className="confirm-modal__title">
            <AlertTriangle size={16} />
            {title}
          </span>
          <button type="button" className="wb-btn wb-btn--secondary wb-btn--icon-only" onClick={onCancel} aria-label="Close dialog">
            <X size={14} />
          </button>
        </div>
        <p className="confirm-modal__message">{message}</p>
        {error && <div className="wb-alert wb-alert--error">{error}</div>}
        <div className="wb-btn-row">
          <button type="button" className="wb-btn wb-btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="wb-btn wb-btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              loadingLabel ?? `${confirmLabel}…`
            ) : (
              <>
                <Check size={14} />
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
