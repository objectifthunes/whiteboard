import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Sentence-case text rendered next to the box. */
  label?: ReactNode
  /** Muted addition after the label, e.g. "(dirty scans)". */
  hint?: ReactNode
}

/**
 * A labeled checkbox row. The input pins its own size and flex so host
 * (or kit) globals like `input { flex: 1 }` can never stretch it across
 * the row.
 */
export function Checkbox({ label, hint, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('checkbox', className)}>
      <input type="checkbox" className="checkbox__input" {...props} />
      {label != null && (
        <span className="checkbox__text">
          {label}
          {hint != null && <span className="checkbox__hint"> {hint}</span>}
        </span>
      )}
    </label>
  )
}

/** A labeled on/off switch — same API as Checkbox, slider visuals. */
export function Switch({ label, hint, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('checkbox', 'switch', className)}>
      <input type="checkbox" role="switch" className="switch__input" {...props} />
      <span className="switch__track" aria-hidden="true">
        <span className="switch__thumb" />
      </span>
      {label != null && (
        <span className="checkbox__text">
          {label}
          {hint != null && <span className="checkbox__hint"> {hint}</span>}
        </span>
      )}
    </label>
  )
}
