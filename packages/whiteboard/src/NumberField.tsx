import type { InputHTMLAttributes, ReactNode } from 'react'
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
 * Labeled numeric input. Values come back as numbers, clamped to
 * [min, max] when provided; non-numeric keystrokes are ignored rather
 * than emitted as NaN.
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
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (Number.isFinite(v)) onChange(clamp(v))
        }}
        {...props}
      />
    </Field>
  )
}
