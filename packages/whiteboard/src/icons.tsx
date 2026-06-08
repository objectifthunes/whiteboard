import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const defaults = (size = 14): SVGProps<SVGSVGElement> => ({
  xmlns: 'http://www.w3.org/2000/svg',
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function Minus({ size, ...props }: IconProps) {
  return <svg {...defaults(size)} {...props}><path d="M5 12h14" /></svg>
}

export function Plus({ size, ...props }: IconProps) {
  return <svg {...defaults(size)} {...props}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
}

export function ScanSearch({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
      <path d="m16 16-1.9-1.9" />
    </svg>
  )
}

export function RotateCcw({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

export function Grid3x3({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  )
}

export function Maximize2({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  )
}

export function Loader2({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export function AlertTriangle({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

export function Check({ size, ...props }: IconProps) {
  return <svg {...defaults(size)} {...props}><path d="M20 6 9 17l-5-5" /></svg>
}

export function X({ size, ...props }: IconProps) {
  return <svg {...defaults(size)} {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
}

export function Moon({ size, ...props }: IconProps) {
  return <svg {...defaults(size)} {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
}

export function Sun({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}
