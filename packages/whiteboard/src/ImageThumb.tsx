
import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

type ImageThumbSize = 'sm' | 'md' | 'fluid'
type ImageThumbFit = 'contain' | 'cover'

interface ImageThumbProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt: string
  placeholder?: ReactNode
  size?: ImageThumbSize
  fit?: ImageThumbFit
  /**
   * Aspect ratio of the frame, as a CSS `aspect-ratio` value
   * (e.g. `"4 / 3"`, `16 / 9`, `1.5`). Defaults to the square 1 / 1.
   */
  ratio?: number | string
  onImageError?: () => void
}

export function ImageThumb({
  src,
  alt,
  placeholder = 'No image',
  size = 'md',
  fit = 'contain',
  ratio,
  onImageError,
  className,
  style,
  ...props
}: ImageThumbProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = Boolean(src && failedSrc === src)

  const classes = cn('image-thumb', `image-thumb--${size}`, `image-thumb--fit-${fit}`, className)
  const frameStyle: CSSProperties | undefined =
    ratio !== undefined ? { aspectRatio: String(ratio), ...style } : style

  return (
    <div className={classes} style={frameStyle} {...props}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className="image-thumb__img"
          style={{ objectFit: fit, objectPosition: 'center' }}
          onError={() => {
            setFailedSrc(src)
            onImageError?.()
          }}
        />
      ) : (
        <span className="image-thumb__placeholder">{placeholder}</span>
      )}
    </div>
  )
}
