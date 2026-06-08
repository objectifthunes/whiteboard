import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from './icons'
import { cn } from './cn'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
  iconOnly?: boolean
  loading?: boolean
  loadingText?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: '',
  secondary: 'wb-btn--secondary',
  danger: 'wb-btn--danger',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    fullWidth = false,
    iconOnly = false,
    loading = false,
    type = 'button',
    disabled,
    className,
    children,
    loadingText,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('wb-btn', variantClasses[variant], fullWidth && 'wb-btn--full-width', iconOnly && 'wb-btn--icon-only', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={14} className="icon-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  )
})
