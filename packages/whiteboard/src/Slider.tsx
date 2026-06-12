import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  /** Uppercase header on the left (rendered like a widget label). */
  label?: ReactNode
  /** Right-aligned readout; defaults to the raw value. */
  display?: ReactNode
  value: number
  onChange: (value: number) => void
}

/**
 * The settings-panel slider pattern: label left, live readout right,
 * range underneath. Numbers come back as numbers.
 */
export function Slider({ label, display, value, onChange, className, ...props }: SliderProps) {
  return (
    <div className={cn('slider', className)}>
      {(label != null || display != null) && (
        <div className="slider__head">
          <span className="widget-label">{label}</span>
          <span className="slider__value">{display ?? value}</span>
        </div>
      )}
      <input
        type="range"
        className="slider__input"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        {...props}
      />
    </div>
  )
}
