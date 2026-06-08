# @objectifthunes/whiteboard

A pan/zoom **whiteboard canvas for React** with draggable floating panels, a minimap, snap-to-grid, and a set of themed UI primitives.

> Live docs + every export demoed at **https://objectifthunes.github.io/whiteboard-demo/**.

## Install

```bash
pnpm add @objectifthunes/whiteboard zustand
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `zustand >= 4`.

## Quick start

```tsx
import '@objectifthunes/whiteboard/style.css'
import { WhiteboardShell, FloatingPanel } from '@objectifthunes/whiteboard'

export function App() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <WhiteboardShell>
        <FloatingPanel title="Hello" defaultPosition={{ x: 100, y: 100 }} focusable>
          Drag me · scroll to zoom · double-click to focus
        </FloatingPanel>
      </WhiteboardShell>
    </div>
  )
}
```

The shell needs a positioned, sized parent — usually `position: relative; height: 100vh` (or any explicit height). Auto-fit kicks in on first paint so panels appear pre-framed.

In Next.js (App Router), make the page that hosts `<WhiteboardShell>` a client component:

```tsx
'use client'
```

`WhiteboardShell` uses `ResizeObserver`, `useEffect`, Zustand subscriptions and `getBoundingClientRect`. For static export, gate first render behind a `mounted` flag.

## Theming

Every component is driven by `--wb-*` CSS custom properties. Override on `:root` or scope to `[data-theme="dark"]`. The package ships sensible defaults.

```css
:root {
  --wb-bg: #f3f4f6;
  --wb-surface: #ffffff;
  --wb-text: #111827;
  --wb-text-muted: #6b7280;
  --wb-border: #e5e7eb;
  --wb-primary: #1f2937;
  --wb-danger: #dc2626;
}
```

`<ThemeToggle theme={…} onToggle={…} />` is controlled — you decide where `data-theme` lives (almost always `<html>`).

## What's in the package

- **Canvas:** `WhiteboardShell`, `FloatingPanel`, `Minimap`, `ZoomBar`, `ConfirmDialog`, `PanelErrorBoundary`
- **Store / hooks:** `useWhiteboardStore`, `useWhiteboardLayout`, `computeWhiteboardFit`, `computeWhiteboardRectFocus`, `usePanelRect`, `belowPanel`, `snapToWhiteboardGrid`, `WHITEBOARD_GRID`, `cn`
- **Primitives:** `Button`, `ButtonRow`, `PanelCloseButton`, `ThemeToggle`, `OverlayIconButton`, `Field`, `Label`, `Input`, `Textarea`, `Select`, `CoordGrid`, `CoordInput`, `Alert`, `Pill`, `Chip`, `TagRow`, `LoadingState`, `GeneratingOverlay`, `EmptyState`, `Stack`, `Inline`, `TitleRow`, `SplitLayout`, `IconText`, `PageShell`, `PageCard`, `PageTitle`, `CardTitle`, `SectionTitle`, `SectionDescription`, `MutedText`, `ItemCard`, `ItemList`, `List`, `PickerCard`, `PickerGrid`, `ChoiceCard`, `ChoiceGroup`, `VerticalToolbar`, `AvatarBadge`, `CanvasStage`, `ImageThumb`, `PanelSection`, `PanelTitle`
- **Skeletons:** `Skeleton`, `LineSkeleton`, `TitleSkeleton`, `ButtonSkeleton`, `IconButtonSkeleton`, `InputSkeleton`, `SelectSkeleton`, `TextareaSkeleton`, `ChipSkeleton`, `ThumbSkeleton`, `AvatarSkeleton`, `CanvasSkeleton`, `PanelFormSkeleton`, `CardSkeleton`, `PickerGridSkeleton`, `ChoiceGroupSkeleton`

See the live demo for the full prop reference and copy-pasteable examples per component.

## Build size

42 KB JS raw / ~10 KB gzip, single 30 KB CSS file. No runtime CSS-in-JS.

## License

MIT.
