import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { cn } from './cn'
import { WHITEBOARD_GRID } from './grid'

/** Elements that must keep their own pointer interactions. */
const INTERACTIVE =
  'button, input, select, textarea, canvas, a, label, audio, video, [contenteditable], [data-wb-nodrag]'

const resetRegistry = new Map<string, () => void>()

/** Snap every Draggable back to its anchored position (and clear persistence). */
export function resetDraggables() {
  for (const fn of resetRegistry.values()) fn()
}

interface DraggableProps extends HTMLAttributes<HTMLDivElement> {
  /** Stable id — keys persistence and the reset registry. */
  id: string
  /** Snap the offset to the whiteboard grid on release. Default true. */
  snap?: boolean
  /** Remember the offset in localStorage. Default true. */
  persist?: boolean
  disabled?: boolean
}

/**
 * Screen-space dragging for overlay chrome — toolbars, legends, log
 * panes — WITHOUT a WhiteboardShell. Keep your CSS anchoring (top/right/
 * bottom/left, even percentage centring on a parent): the drag is a
 * translate() delta on top of it, so layouts stay responsive and reset
 * is just "delta = 0".
 *
 * - drags from any non-interactive area (inputs, buttons, canvases keep
 *   their own pointer behaviour)
 * - snaps to WHITEBOARD_GRID on release; honours the global
 *   `whiteboard-snap-now` event dispatched by ZoomBar
 * - double-click an empty area to reset one element;
 *   `resetDraggables()` resets them all
 * - position persists per `id` in localStorage
 */
export function Draggable({
  id,
  snap = true,
  persist = true,
  disabled = false,
  className,
  style,
  children,
  ...props
}: DraggableProps) {
  const [delta, setDelta] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ sx: number; sy: number; bx: number; by: number } | null>(null)
  const storageKey = `wb-draggable:${id}`

  // Hydrate the persisted offset after mount (SSR-safe).
  useEffect(() => {
    if (!persist) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const v = JSON.parse(raw)
        if (Number.isFinite(v?.x) && Number.isFinite(v?.y)) setDelta(v)
      }
    } catch {
      // private mode / blocked storage — live without persistence
    }
  }, [storageKey, persist])

  const commit = (next: { x: number; y: number }) => {
    setDelta(next)
    if (!persist) return
    try {
      if (next.x === 0 && next.y === 0) localStorage.removeItem(storageKey)
      else localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const reset = () => commit({ x: 0, y: 0 })
    resetRegistry.set(id, reset)
    const snapNow = () => {
      setDelta((d) => ({
        x: Math.round(d.x / WHITEBOARD_GRID) * WHITEBOARD_GRID,
        y: Math.round(d.y / WHITEBOARD_GRID) * WHITEBOARD_GRID,
      }))
    }
    window.addEventListener('whiteboard-snap-now', snapNow)
    return () => {
      resetRegistry.delete(id)
      window.removeEventListener('whiteboard-snap-now', snapNow)
    }
    // commit is stable enough for this lifecycle; id/key drive identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, storageKey])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return
    if ((e.target as Element).closest(INTERACTIVE)) return
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: delta.x, by: delta.y }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d) return
    setDelta({ x: d.bx + (e.clientX - d.sx), y: d.by + (e.clientY - d.sy) })
  }
  const onPointerUp = () => {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null
    setDelta((current) => {
      const next = snap
        ? {
            x: Math.round(current.x / WHITEBOARD_GRID) * WHITEBOARD_GRID,
            y: Math.round(current.y / WHITEBOARD_GRID) * WHITEBOARD_GRID,
          }
        : current
      // commit outside the updater would double-set; persist inline
      if (persist) {
        try {
          if (next.x === 0 && next.y === 0) localStorage.removeItem(storageKey)
          else localStorage.setItem(storageKey, JSON.stringify(next))
        } catch {
          // ignore
        }
      }
      return next
    })
  }
  const onDoubleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest(INTERACTIVE)) return
    commit({ x: 0, y: 0 })
  }

  return (
    <div
      className={cn('draggable', disabled && 'draggable--disabled', className)}
      style={{
        ...style,
        transform: `translate(${delta.x}px, ${delta.y}px)`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
      {...props}
    >
      {children}
    </div>
  )
}

interface DraggableSurfaceProps extends DraggableProps {
  padding?: 'none' | 'sm' | 'md'
}

/** A Surface you can drag — the overlay-panel workhorse. */
export function DraggableSurface({ padding = 'md', className, ...props }: DraggableSurfaceProps) {
  return (
    <Draggable
      className={cn(
        'surface',
        padding === 'sm' && 'surface--pad-sm',
        padding === 'none' && 'surface--pad-none',
        className
      )}
      {...props}
    />
  )
}
