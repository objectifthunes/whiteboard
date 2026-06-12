import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'
import { Field } from './Field'
import { Input } from './Input'

interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  label?: ReactNode
  hint?: ReactNode
  value: number
  onChange: (value: number) => void
}

/**
 * Labeled numeric input. Emits in realtime while typing, but only
 * MEANINGFUL numbers: an empty field, `0`, or unparseable input keeps
 * the previous value (no snap-to-min while you clear and retype), and
 * blurring an empty/invalid field restores the previous value visually.
 * Valid values are clamped to [min, max].
 */
export function NumberField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  id,
  className,
  ...props
}: NumberFieldProps) {
  // While editing, the field shows the raw draft so intermediate states
  // ("", "0", "0.") survive; when not editing it mirrors `value`.
  const [draft, setDraft] = useState<string | null>(null)
  const clamp = (v: number) => {
    let out = v
    if (min !== undefined) out = Math.max(Number(min), out)
    if (max !== undefined) out = Math.min(Number(max), out)
    return out
  }
  return (
    <Field label={label} hint={hint} htmlFor={id} className={cn(className)}>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={draft ?? String(value)}
        onChange={(e) => {
          const raw = e.target.value
          setDraft(raw)
          if (raw.trim() === '') return
          const v = Number(raw)
          if (!Number.isFinite(v) || v === 0) return
          onChange(clamp(v))
        }}
        onBlur={() => setDraft(null)}
        {...props}
      />
    </Field>
  )
}
