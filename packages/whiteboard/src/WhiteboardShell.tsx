
import { useRef, useCallback, useEffect, type ReactNode, type PointerEvent, type WheelEvent } from 'react'
import { ZoomBar } from './ZoomBar'
import { Minimap } from './Minimap'
import { useWhiteboardStore } from './store'

interface Props {
  children: ReactNode
  showMinimap?: boolean
  minimapLoading?: boolean
  /** Extra action buttons rendered inside the ZoomBar (e.g. a theme toggle) */
  extraActions?: ReactNode
}

export function WhiteboardShell({ children, showMinimap = true, minimapLoading = false, extraActions }: Props) {
  const offset = useWhiteboardStore(s => s.offset)
  const scale = useWhiteboardStore(s => s.scale)
  const registryVersion = useWhiteboardStore(s => s.registryVersion)
  const viewportSize = useWhiteboardStore(s => s.viewportSize)
  const setOffset = useWhiteboardStore(s => s.setOffset)
  const setScale = useWhiteboardStore(s => s.setScale)
  const setViewportSize = useWhiteboardStore(s => s.setViewportSize)

  const shellRef = useRef<HTMLDivElement>(null)
  const panning = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const activePointerId = useRef<number | null>(null)
  const scaleRef = useRef(scale)
  const hasFitted = useRef(false)

  // Reset stale state when leaving the page so the next mount starts clean.
  useEffect(() => {
    return () => { useWhiteboardStore.getState().resetSession() }
  }, [])

  useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const updateViewport = () => {
      const rect = shell.getBoundingClientRect()
      setViewportSize({
        width: Math.max(0, rect.width),
        height: Math.max(0, rect.height),
      })
    }

    updateViewport()
    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(updateViewport)
    observer.observe(shell)
    return () => observer.disconnect()
  }, [setViewportSize])

  // Auto-fit on first meaningful panel registration.
  useEffect(() => {
    if (hasFitted.current) return
    const { panels } = useWhiteboardStore.getState()
    if (panels.size === 0 || viewportSize.width <= 0 || viewportSize.height <= 0) return
    hasFitted.current = true
    requestAnimationFrame(() => {
      useWhiteboardStore.getState().fitToContent()
    })
  }, [registryVersion, viewportSize])

  const onDown = useCallback((e: PointerEvent) => {
    if (e.target !== e.currentTarget) return
    if (e.button === 0 || e.button === 1) {
      panning.current = true
      activePointerId.current = e.pointerId
      last.current = { x: e.clientX, y: e.clientY }
      e.currentTarget.setPointerCapture(e.pointerId)
      e.preventDefault()
    }
  }, [])

  const onMove = useCallback((e: PointerEvent) => {
    if (!panning.current || activePointerId.current !== e.pointerId) return
    const dx = e.movementX ?? (e.clientX - last.current.x)
    const dy = e.movementY ?? (e.clientY - last.current.y)
    setOffset(p => ({ x: p.x + dx, y: p.y + dy }))
    last.current = { x: e.clientX, y: e.clientY }
  }, [setOffset])

  const stopPan = useCallback((e: PointerEvent) => {
    if (activePointerId.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(activePointerId.current)
      } catch {
        // ignore if capture was already released
      }
    }
    panning.current = false
    activePointerId.current = null
  }, [])

  const onWheel = useCallback((e: WheelEvent) => {
    const s = scaleRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const anchor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    const nextScale = Math.min(3, Math.max(0.2, s * (e.deltaY > 0 ? 0.9 : 1.1)))
    const ratio = nextScale / s

    setOffset(prev => ({
      x: anchor.x - (anchor.x - prev.x) * ratio,
      y: anchor.y - (anchor.y - prev.y) * ratio,
    }))
    setScale(nextScale)
  }, [setOffset, setScale])

  return (
    <>
      <div
        ref={shellRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={stopPan}
        onPointerCancel={stopPan}
        onWheel={onWheel}
        onContextMenu={e => e.preventDefault()}
        className="whiteboard-shell"
      >
        <div
          className="whiteboard-canvas"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        >
          <div className="whiteboard-grid" aria-hidden />
          {children}
        </div>
      </div>
      <ZoomBar extraActions={extraActions} />
      {showMinimap ? <Minimap loading={minimapLoading} /> : null}
    </>
  )
}
