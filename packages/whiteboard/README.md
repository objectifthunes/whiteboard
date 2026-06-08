# @objectifthunes/whiteboard

A pan / zoom **whiteboard canvas for React** with draggable floating panels, a minimap, snap-to-grid, and a complete set of UI primitives — all themed via CSS custom properties.

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/overview.png" width="49%" alt="All panels, light mode" />
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/dark.png" width="49%" alt="All panels, dark mode" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/detail.png" width="98%" alt="Panels zoomed in" />
</p>

> One package, zero design system lock-in: drop `<WhiteboardShell>` into any React app and start placing panels.

---

## Highlights

- **Pan & zoom canvas** — drag to pan, scroll/pinch to zoom, pointer-capture safe.
- **Floating panels** — drag to reposition, double-click to focus, snap to grid.
- **Minimap** — live overview with click / drag navigation and per-panel double-click focus.
- **ZoomBar** — zoom in/out, fit to content, reset positions, snap toggle, extra slots.
- **Zustand store** — full programmatic control (`fitToContent`, `focusPanel`, `resetWidgets`, …).
- **45+ UI components** — buttons, forms, alerts, typography, skeletons, dialogs, cards, navigation.
- **Light / dark theme** — CSS custom properties + the built-in `<ThemeToggle />`.
- **Tiny** — 42 kB raw / 10 kB gzipped JS, single CSS file.
- **Tree-shakeable ESM** + full TypeScript declarations.

---

## Install

```bash
npm install @objectifthunes/whiteboard
# peer deps
npm install react react-dom zustand
```

Peer-dependency ranges: `react >= 18`, `react-dom >= 18`, `zustand >= 4`.

---

## Quick Start

```tsx
import '@objectifthunes/whiteboard/style.css'
import {
  WhiteboardShell,
  FloatingPanel,
  ThemeToggle,
} from '@objectifthunes/whiteboard'

export function App() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <WhiteboardShell extraActions={<ThemeToggle />}>
        <FloatingPanel
          title="My Panel"
          defaultPosition={{ x: 100, y: 100 }}
          focusable
        >
          Drag me · Scroll to zoom · Double-click to focus
        </FloatingPanel>
      </WhiteboardShell>
    </div>
  )
}
```

The shell needs a positioned, sized parent — usually `position: relative; height: 100vh` (or any explicit height). Auto-fit kicks in on first paint, so panels appear pre-framed.

---

## Component Index

**Whiteboard:** [WhiteboardShell](#whiteboardshell) · [FloatingPanel](#floatingpanel) · [Minimap](#minimap) · [ZoomBar](#zoombar) · [ConfirmDialog](#confirmdialog) · [PanelErrorBoundary](#panelerrorboundary)

**Store & hooks:** [useWhiteboardStore](#usewhiteboardstore) · [useWhiteboardLayout](#usewhiteboardlayout) · [Geometry helpers](#geometry-helpers) · [Panel-rect helpers](#panel-rect-helpers)

**UI — Buttons:** [Button](#button) · [ButtonRow](#buttonrow) · [PanelCloseButton](#panelclosebutton)

**UI — Forms:** [Field](#field) · [Label](#label) · [Input](#input) · [Textarea](#textarea) · [Select](#select) · [CoordGrid · CoordInput](#coordgrid--coordinput)

**UI — Status & Feedback:** [Alert](#alert) · [Pill](#pill) · [Chip](#chip) · [TagRow](#tagrow) · [LoadingState](#loadingstate)

**UI — Layout:** [Stack](#stack) · [Inline](#inline) · [TitleRow](#titlerow) · [SplitLayout](#splitlayout) · [IconText](#icontext) · [PageShell · PageCard](#pageshell--pagecard)

**UI — Typography:** [PageTitle](#pagetitle) · [StoryTitle](#storytitle) · [AssetTitle](#assettitle) · [SectionTitle · SectionDescription](#sectiontitle--sectiondescription) · [MutedText](#mutedtext)

**UI — Cards & Lists:** [ItemCard](#itemcard) · [ItemList](#itemlist) · [List](#list) · [PickerCard](#pickercard) · [PickerGrid](#pickergrid) · [ChoiceCard](#choicecard) · [ChoiceGroup](#choicegroup)

**UI — Overlays:** [GeneratingOverlay](#generatingoverlay) · [EmptyState](#emptystate) · [PanelErrorBoundary](#panelerrorboundary)

**UI — Navigation & Canvas:** [VerticalToolbar](#verticaltoolbar) · [AvatarBadge](#avatarbadge) · [CanvasStage](#canvasstage) · [OverlayIconButton](#overlayiconbutton) · [ImageThumb](#imagethumb)

**UI — Skeletons:** [Skeleton](#skeleton-base) · [Primitive skeletons](#primitive-skeletons) · [Widget skeletons](#widget-skeletons) · [ChoiceGroupSkeleton](#choicegroupskeleton)

**UI — Panel sections:** [PanelSection](#panelsection) · [PanelTitle](#paneltitle)

**Theming:** [ThemeToggle](#themetoggle) · [CSS custom properties](#css--theming)

---

## Whiteboard Components

### `WhiteboardShell`

The root container. Handles pan, zoom, viewport tracking, auto-fit on first mount, session reset on unmount, and renders the `ZoomBar` + `Minimap`.

```tsx
<WhiteboardShell
  showMinimap={true}              // default: true
  minimapLoading={false}          // show a spinner inside the minimap
  extraActions={<ThemeToggle />}  // any node rendered inside the ZoomBar
>
  {/* FloatingPanels go here */}
</WhiteboardShell>
```

| Prop             | Type        | Default | Description                                  |
| ---------------- | ----------- | ------- | -------------------------------------------- |
| `children`       | `ReactNode` | —       | Panels (any node) rendered on the canvas.    |
| `showMinimap`    | `boolean`   | `true`  | Render the minimap in the bottom corner.     |
| `minimapLoading` | `boolean`   | `false` | Show a spinner instead of the minimap rects. |
| `extraActions`   | `ReactNode` | —       | Extra controls rendered at the bottom of the ZoomBar (theme toggle, custom action). |

**Interactions out of the box**

- Drag canvas background → pan
- Scroll wheel → zoom toward cursor (clamped `0.2`–`3`)
- Right-click is consumed (no native context menu over the canvas)
- ResizeObserver keeps the viewport size in sync
- `resetSession` runs on unmount so the next mount starts clean

---

### `FloatingPanel`

A draggable card placed on the canvas.

```tsx
<FloatingPanel
  title="Settings"
  defaultPosition={{ x: 100, y: 80 }}
  width={320}                       // default: 300
  focusable                         // adds the focus button in the header
  focusPadding={40}                 // padding when focusing (default: 40)
  focusMaxScale={1.5}               // max zoom when focusing (default: 1.5)
  headerActions={<Button>…</Button>}
  trackRect={rectRef}               // MutableRefObject<PanelRect>, kept in sync
>
  {/* any content */}
</FloatingPanel>
```

| Prop              | Type                                | Default | Description |
| ----------------- | ----------------------------------- | ------- | ----------- |
| `title`           | `ReactNode`                         | —       | Header label. |
| `defaultPosition` | `{ x: number, y: number }`          | —       | Initial world-space position. |
| `width`           | `number`                            | `300`   | Pixel width. Height is content-driven. |
| `focusable`       | `boolean`                           | `false` | Renders the corner focus button. |
| `focusPadding`    | `number`                            | `40`    | Padding used by the focus camera. |
| `focusMaxScale`   | `number`                            | `1.5`   | Camera scale ceiling when focusing. |
| `headerActions`   | `ReactNode`                         | —       | Buttons rendered next to the focus button. |
| `trackRect`       | `MutableRefObject<PanelRect>`       | —       | Ref kept in sync with current `{x, y, width, height, focusPadding, focusMaxScale}`. |
| `className`       | `string`                            | —       | Extra class merged onto the panel root. |

Double-click the panel or press the focus button to zoom the camera to that panel. Snap-to-grid (toggled in the `ZoomBar`) also realigns the panel on activation.

---

### `Minimap`

Lives in the bottom-right corner, scaled to panel content bounds. Click to pan, drag to scrub, scroll to zoom, double-click a panel rect to focus it.

```tsx
<WhiteboardShell showMinimap minimapLoading={false} />
// Renders <Minimap loading={false} /> internally
```

You normally don't render `<Minimap>` directly — `WhiteboardShell` does it for you.

| Prop      | Type      | Default | Description                            |
| --------- | --------- | ------- | -------------------------------------- |
| `loading` | `boolean` | `false` | Show a spinner instead of panel rects. |

---

### `ZoomBar`

Vertical bar in the right edge with: zoom out, current %, zoom in, **Fit to content**, **Reset positions**, **Snap to grid** toggle, and any `extraActions` you pass in.

```tsx
<ZoomBar extraActions={<ThemeToggle />} />
```

Like `<Minimap>`, this is rendered by `WhiteboardShell` — only render it directly if you're building a custom shell. The component reads & writes directly to `useWhiteboardStore`.

---

### `ConfirmDialog`

A portaled, accessible confirmation dialog. Closes on `Escape`, click outside, or the Cancel button.

```tsx
<ConfirmDialog
  open={open}
  title="Delete scene?"
  message="This cannot be undone."
  confirmLabel="Delete"
  loading={deleting}
  error={errorMessage}
  onConfirm={handleDelete}
  onCancel={() => setOpen(false)}
/>
```

| Prop           | Type                | Default            | Description                                  |
| -------------- | ------------------- | ------------------ | -------------------------------------------- |
| `open`         | `boolean`           | —                  | Controls visibility.                         |
| `title`        | `string`            | —                  | Dialog title (also `aria-label`).            |
| `message`      | `string`            | —                  | Body text.                                   |
| `confirmLabel` | `string`            | `'Confirm'`        | Confirm button label.                        |
| `loadingLabel` | `string`            | `'<confirmLabel>…'` | Confirm button label while `loading`.       |
| `loading`     | `boolean`           | `false`            | Disables confirm and swaps to `loadingLabel`. |
| `error`        | `string \| null`    | —                  | Inline error shown above the actions.        |
| `onConfirm`    | `() => void`        | —                  | Confirm handler.                             |
| `onCancel`     | `() => void`        | —                  | Cancel handler (also fires on Escape / backdrop). |

---

### `PanelErrorBoundary`

A class-based error boundary that renders a friendly fallback + Retry button when a panel's subtree throws.

```tsx
<PanelErrorBoundary fallbackMessage="This panel crashed.">
  <PotentiallyBrokenWidget />
</PanelErrorBoundary>
```

| Prop              | Type     | Default                  |
| ----------------- | -------- | ------------------------ |
| `fallbackMessage` | `string` | `'This panel crashed.'` |

---

## Store & Hooks

### `useWhiteboardStore`

A Zustand store that exposes camera, viewport, panels registry, and actions.

```ts
import { useWhiteboardStore } from '@objectifthunes/whiteboard'

const offset         = useWhiteboardStore(s => s.offset)         // { x, y }
const scale          = useWhiteboardStore(s => s.scale)          // 0.2 — 3
const snapToGrid     = useWhiteboardStore(s => s.snapToGrid)
const setSnapToGrid  = useWhiteboardStore(s => s.setSnapToGrid)
const fitToContent   = useWhiteboardStore(s => s.fitToContent)
const focusPanel     = useWhiteboardStore(s => s.focusPanel)
const resetWidgets   = useWhiteboardStore(s => s.resetWidgets)
```

**Selectors (state)**

| Key                | Type                                    |
| ------------------ | --------------------------------------- |
| `offset`           | `{ x: number, y: number }`              |
| `scale`            | `number` (clamped 0.2–3)                |
| `viewportSize`     | `{ width: number, height: number }`     |
| `snapToGrid`       | `boolean`                               |
| `snapGridSize`     | `number` (defaults to `20`)             |
| `panels`           | `Map<string, PanelRect>`                |
| `resetFns`         | `Map<string, () => void>`               |
| `registryVersion`  | `number` (bumps on registry change)     |

**Actions**

| Method                | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `setOffset(v)`        | Set camera offset (value or updater).                      |
| `setScale(v)`         | Set camera scale.                                          |
| `setViewportSize(v)`  | Called automatically by the shell.                         |
| `setSnapToGrid(v)`    | Toggle snap mode. Dispatches `whiteboard-snap-now` so existing panels realign. |
| `register(id, rect)`  | Add/replace a panel rect. Called by `FloatingPanel`.       |
| `unregister(id)`      | Remove a panel rect.                                       |
| `registerReset(id, fn)` / `unregisterReset(id)` | Register a reset handler for `resetWidgets`. |
| `fitToContent()`      | Reframe the camera so all registered panels fit (with padding). |
| `focusPanel(rect, { padding?, maxScale? })` | Reframe the camera onto a single rect. |
| `resetWidgets()`      | Call every panel's reset handler then re-fit.              |
| `resetSession()`      | Discard all state. Called on shell unmount.                |

---

### `useWhiteboardLayout`

Compute snap-aligned default positions from a map of panel widths. Returns world-space coords that you feed into each panel's `defaultPosition`.

```tsx
const { positions, panelWidth, layout } = useWhiteboardLayout({
  widths: { settings: 320, preview: 480, layers: 280 },
  startX: 40,
  y: 60,
  gap: 20,
})

// positions.settings → { x: 40,  y: 60 }
// positions.preview  → { x: 380, y: 60 }
// positions.layers   → { x: 880, y: 60 }
```

All inputs are normalized to `WHITEBOARD_GRID` (20 px) so panels stay snapped even with snap mode off.

---

### Geometry helpers

```ts
import {
  computeWhiteboardFit,        // ({ panels, viewportSize, padding? }) → { scale, offset } | null
  computeWhiteboardRectFocus,  // ({ rect, viewportSize, padding?, maxScale? }) → { scale, offset }
  snapToWhiteboardGrid,        // (n: number) → nearest multiple of 20
  WHITEBOARD_GRID,             // constant: 20
} from '@objectifthunes/whiteboard'
```

These are the same primitives that power `fitToContent` and `focusPanel`. Use them when you need to drive the camera from a custom source (URL state, animation, etc).

---

### Panel-rect helpers

```ts
import { usePanelRect, belowPanel } from '@objectifthunes/whiteboard'

const settingsRect = usePanelRect({ x: 100, y: 100 })

return (
  <>
    <FloatingPanel title="Settings" defaultPosition={{ x: 100, y: 100 }} trackRect={settingsRect}>…</FloatingPanel>
    <FloatingPanel title="Preview"  defaultPosition={belowPanel(settingsRect.current)}>…</FloatingPanel>
  </>
)
```

- `usePanelRect(initial)` → `MutableRefObject<PanelRect>` with `width`/`height` filled after first measurement.
- `belowPanel(rect, gap = WHITEBOARD_GRID)` → `{ x, y }` for the next panel directly below.

---

### `cn(...)`

Tiny class-name joiner, exported for users who don't already pull in `clsx` / `classnames`.

```ts
import { cn } from '@objectifthunes/whiteboard'
cn('btn', isPrimary && 'btn--primary', className)
// → "btn btn--primary <className>"
```

---

## UI — Buttons

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-button.png" width="380" alt="Button, ButtonRow, PanelCloseButton" />
</p>

### `Button`

```tsx
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button loading loadingText="Saving…">Save</Button>
<Button disabled>Disabled</Button>
<Button iconOnly aria-label="Delete"><TrashIcon /></Button>
<Button fullWidth>Stretch</Button>
```

| Prop          | Type                                  | Default     |
| ------------- | ------------------------------------- | ----------- |
| `variant`     | `'primary' \| 'secondary' \| 'danger'`| `'primary'` |
| `fullWidth`   | `boolean`                             | `false`     |
| `iconOnly`    | `boolean`                             | `false`     |
| `loading`     | `boolean`                             | `false`     |
| `loadingText` | `string`                              | —           |
| All native `<button>` props | …                       | —           |

`loading` automatically disables the button and prefixes a spinner.

### `ButtonRow`

A horizontal row that gives equal sizing + a consistent gap to all children.

```tsx
<ButtonRow>
  <Button variant="secondary">Cancel</Button>
  <Button>Confirm</Button>
</ButtonRow>
```

| Prop  | Type          | Default |
| ----- | ------------- | ------- |
| `as`  | `ElementType` | `'div'` |

### `PanelCloseButton`

A pre-built secondary button with an `X` icon. Use it inside a panel's `headerActions`.

```tsx
<PanelCloseButton onClick={onClose} label="Close" />
```

| Prop      | Type         | Default    |
| --------- | ------------ | ---------- |
| `onClick` | `() => void` | —          |
| `label`   | `string`     | `'Close'`  |

---

## UI — Forms

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-forms.png" width="380" alt="Field, Input, Textarea, Select, CoordGrid" />
</p>

### `Field`

Wraps a control with a label, optional hint and inline error.

```tsx
<Field label="Name" htmlFor="name" hint="Display name" error={errors.name}>
  <Input id="name" placeholder="John Doe" />
</Field>

<Field as="fieldset" label="Notifications" layout="control">
  {/* checkbox stack */}
</Field>
```

| Prop      | Type                       | Default   |
| --------- | -------------------------- | --------- |
| `label`   | `ReactNode`                | —         |
| `htmlFor` | `string`                   | —         |
| `hint`    | `ReactNode`                | —         |
| `error`   | `ReactNode`                | —         |
| `layout`  | `'stack' \| 'control'`     | `'stack'` |
| `as`      | `ElementType`              | `'div'`   |

### `Label`

Bare styled `<label>`. Most of the time you'll get one for free from `<Field>`.

```tsx
<Label htmlFor="email">Email</Label>
```

### `Input`

Styled `<input>`. Accepts all native input props; supports refs.

```tsx
<Input type="email" placeholder="you@example.com" />
```

### `Textarea`

Styled `<textarea>`. Supports refs.

```tsx
<Textarea rows={4} placeholder="About you…" />
```

### `Select`

Styled `<select>`. Supports refs.

```tsx
<Select defaultValue="light">
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</Select>
```

### `CoordGrid` / `CoordInput`

Two-column grid for `x / y / z / scale`-style numeric inputs.

```tsx
<CoordGrid>
  <CoordInput axis="X" value={x} onChange={e => setX(+e.target.value)} />
  <CoordInput axis="Y" value={y} onChange={e => setY(+e.target.value)} />
  <CoordInput axis="Z" value={z} onChange={e => setZ(+e.target.value)} />
  <CoordInput axis="Scale" value={s} onChange={e => setS(+e.target.value)} />
</CoordGrid>
```

`CoordInput` forces `type="number"` and `step="0.01"`. Pass any other native input prop through.

---

## UI — Status & Feedback

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-status.png" width="380" alt="Alert, Pill, Chip, TagRow, LoadingState" />
</p>

### `Alert`

A one-line status message with four tones.

```tsx
<Alert tone="info">Everything looks good.</Alert>
<Alert tone="success">Saved.</Alert>
<Alert tone="error">Something went wrong.</Alert>
<Alert tone="muted">No results.</Alert>
```

| Prop   | Type                                          | Default  |
| ------ | --------------------------------------------- | -------- |
| `tone` | `'info' \| 'success' \| 'error' \| 'muted'`   | `'info'` |

### `Pill`

A compact rounded label.

```tsx
<Pill>Draft</Pill>
<Pill tone="success">Published</Pill>
<Pill tone="warning">Review</Pill>
<Pill tone="danger">Rejected</Pill>
```

| Prop   | Type                                              | Default     |
| ------ | ------------------------------------------------- | ----------- |
| `tone` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` |

### `Chip`

A subtle tag-style label, perfect for tech tags or filters.

```tsx
<Chip>React</Chip>
<Chip>TypeScript</Chip>
```

### `TagRow`

A horizontal wrapping row for chips, pills, or any small inline items.

```tsx
<TagRow>
  <Chip>react</Chip>
  <Chip>typescript</Chip>
  <Chip>vite</Chip>
</TagRow>
```

### `LoadingState`

An inline spinner + label.

```tsx
<LoadingState label="Fetching…" />
<LoadingState />               {/* defaults to "Loading..." */}
```

| Prop    | Type     | Default        |
| ------- | -------- | -------------- |
| `label` | `string` | `'Loading...'` |

---

## UI — Layout

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-layout.png" width="380" alt="Stack, Inline, TitleRow, SplitLayout, IconText" />
</p>

### `Stack`

Vertical flex container with a consistent gap.

```tsx
<Stack size="md">{/* default */}
  <SectionTitle>Settings</SectionTitle>
  <p>…</p>
</Stack>

<Stack size="sm" as="section">…</Stack>
```

| Prop   | Type            | Default |
| ------ | --------------- | ------- |
| `size` | `'sm' \| 'md'`  | `'md'`  |
| `as`   | `ElementType`   | `'div'` |

### `Inline`

Horizontal row with controllable justification.

```tsx
<Inline justify="start">…</Inline>
<Inline justify="between">…</Inline>
<Inline justify="end">…</Inline>
```

| Prop      | Type                              | Default   |
| --------- | --------------------------------- | --------- |
| `justify` | `'start' \| 'between' \| 'end'`   | `'start'` |
| `as`      | `ElementType`                     | `'div'`   |

### `TitleRow`

A `space-between` row tailored for `title + action` pairs.

```tsx
<TitleRow>
  <SectionTitle>Layers</SectionTitle>
  <Button variant="secondary">Add</Button>
</TitleRow>
```

### `SplitLayout`

Two-column responsive grid (image + content, avatar + meta, etc.).

```tsx
<SplitLayout variant="element">
  <ImageThumb src={thumb} alt="Cover" size="md" />
  <Stack size="sm">
    <AssetTitle>Hero</AssetTitle>
    <MutedText>Updated 5 min ago</MutedText>
  </Stack>
</SplitLayout>
```

| Prop      | Type                                       | Default |
| --------- | ------------------------------------------ | ------- |
| `variant` | `'element' \| 'character' \| 'user'`       | —       |

### `IconText`

Inline icon + text helper.

```tsx
<IconText icon={<CheckIcon size={14} />}>Connected</IconText>
<IconText as="span" icon={<CalendarIcon size={14} />}>Due Friday</IconText>
```

| Prop   | Type           | Default  |
| ------ | -------------- | -------- |
| `icon` | `ReactNode`    | —        |
| `as`   | `ElementType`  | `'span'` |

### `PageShell` / `PageCard`

Page-level containers — `PageShell` is a `<main>` with consistent padding; `PageCard` is a bordered card. Use these outside the whiteboard for full-page screens.

```tsx
<PageShell>
  <PageCard>
    <h1>Account</h1>
    …
  </PageCard>
</PageShell>
```

---

## UI — Typography

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-typography.png" width="380" alt="PageTitle, StoryTitle, AssetTitle, SectionTitle, SectionDescription, MutedText" />
</p>

All typography primitives accept `as` for the rendered tag and pass through any HTML attributes.

### `PageTitle`

Top-level page heading.

```tsx
<PageTitle>Account settings</PageTitle>
<PageTitle as="h2">Embedded title</PageTitle>
```

### `StoryTitle`

Slightly smaller hero-style title for story / item cards.

```tsx
<StoryTitle>The night the lights went out</StoryTitle>
```

### `AssetTitle`

Compact title used in lists. Set `clamp` to truncate at one line.

```tsx
<AssetTitle clamp>Very, very, very long asset name</AssetTitle>
```

| Prop    | Type      | Default |
| ------- | --------- | ------- |
| `clamp` | `boolean` | `false` |

### `SectionTitle` / `SectionDescription`

The label + supporting copy you place above a panel section.

```tsx
<SectionTitle>Assets</SectionTitle>
<SectionDescription>Drag an asset onto the canvas.</SectionDescription>
```

### `MutedText`

De-emphasized paragraph for hints and metadata.

```tsx
<MutedText size="xs">Last edited 5 min ago</MutedText>
<MutedText>Helper copy.</MutedText>
<MutedText size="md">Wider helper copy.</MutedText>
```

| Prop   | Type                    | Default |
| ------ | ----------------------- | ------- |
| `size` | `'xs' \| 'sm' \| 'md'`  | `'sm'`  |

---

## UI — Cards & Lists

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-cards.png" width="380" alt="ItemCard, ItemList, PickerGrid, ChoiceGroup" />
</p>

### `ItemCard`

Bordered card used inside lists — elements, facts, secrets, users, characters, assets.

```tsx
<ItemCard as="li">
  <Inline justify="between">
    <span>Character sprite</span>
    <Pill tone="success">Active</Pill>
  </Inline>
</ItemCard>
```

### `ItemList`

Vertical list container with a consistent gap. Pairs with `ItemCard`.

```tsx
<ItemList as="ul">
  <ItemCard as="li">First</ItemCard>
  <ItemCard as="li">Second</ItemCard>
</ItemList>
```

### `List`

A `list-style: none` reset, useful when you need an unstyled `<ul>` / `<ol>`.

```tsx
<List as="ul">
  <li>Alpha</li>
  <li>Beta</li>
</List>

<List reset={false}>…still has bullets</List>
```

| Prop    | Type          | Default |
| ------- | ------------- | ------- |
| `as`    | `ElementType` | `'ul'`  |
| `reset` | `boolean`     | `true`  |

### `PickerCard`

A clickable card used inside `PickerGrid`. Defaults to `<button>` (set `as="div"` for skeletons).

```tsx
<PickerCard onClick={() => select('a')}>Option A</PickerCard>
<PickerCard as="div" className="picker-card--skeleton">…</PickerCard>
```

### `PickerGrid`

Responsive grid of `PickerCard`s.

```tsx
<PickerGrid variant="elements">
  <PickerCard onClick={…}>A</PickerCard>
  <PickerCard onClick={…}>B</PickerCard>
</PickerGrid>
```

| Prop      | Type                                       | Default |
| --------- | ------------------------------------------ | ------- |
| `variant` | `'elements' \| 'characters' \| 'library'`  | —       |

### `ChoiceCard`

Single selectable card. Manage `active` from a controlled state.

```tsx
<ChoiceCard active={value === 'a'} onClick={() => setValue('a')}>
  Option A
</ChoiceCard>
```

| Prop     | Type      | Default |
| -------- | --------- | ------- |
| `active` | `boolean` | `false` |

### `ChoiceGroup`

Radio-style list of `ChoiceCard`s built from a typed options array.

```tsx
type Direction = 'left' | 'right'

<ChoiceGroup<Direction>
  options={[
    { value: 'left',  label: 'Left to right' },
    { value: 'right', label: 'Right to left', description: 'Arabic, Hebrew' },
  ]}
  value={direction}
  onChange={setDirection}
/>
```

Each option:

```ts
type ChoiceOption<T> = {
  value: T
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}
```

---

## UI — Overlays

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-overlays.png" width="380" alt="ConfirmDialog, GeneratingOverlay, EmptyState, PanelErrorBoundary" />
</p>

> `ConfirmDialog` and `PanelErrorBoundary` are documented under [Whiteboard Components](#confirmdialog) — they're not purely UI primitives.

### `GeneratingOverlay`

Cover content with a semi-transparent layer + spinner while work is in progress.

```tsx
<GeneratingOverlay isGenerating={loading} message="Building…">
  <YourContent />
</GeneratingOverlay>
```

| Prop           | Type        | Default                       |
| -------------- | ----------- | ----------------------------- |
| `isGenerating` | `boolean`   | —                             |
| `message`      | `string`    | `'Generating, please wait…'`  |

### `EmptyState`

Friendly placeholder for empty lists / first-run states.

```tsx
<EmptyState
  title="No items yet"
  description="Create your first item to get started."
  action={<Button>Create item</Button>}
/>
```

| Prop          | Type        | Default |
| ------------- | ----------- | ------- |
| `title`       | `ReactNode` | —       |
| `description` | `ReactNode` | —       |
| `action`      | `ReactNode` | —       |

---

## UI — Navigation & Canvas

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-navigation.png" width="380" alt="VerticalToolbar, AvatarBadge, CanvasStage, OverlayIconButton" />
</p>

### `VerticalToolbar`

A fixed vertical strip of icon buttons (think app-shell sidebar).

```tsx
<VerticalToolbar
  position="left"           // 'left' | 'right' | 'static'
  bottom={<button className="vertical-toolbar__icon-btn">⎋</button>}
>
  <a className="vertical-toolbar__icon-btn is-active" href="/"><DashboardIcon /></a>
  <a className="vertical-toolbar__icon-btn"          href="/stories"><BookIcon /></a>
</VerticalToolbar>
```

| Prop       | Type                              | Default |
| ---------- | --------------------------------- | ------- |
| `position` | `'left' \| 'right' \| 'static'`   | `'left'`|
| `bottom`   | `ReactNode`                       | —       |

### `AvatarBadge`

A circular initials/avatar badge.

```tsx
<AvatarBadge>MG</AvatarBadge>
<AvatarBadge title="Maxence">M</AvatarBadge>
```

### `CanvasStage`

A 16:9 bordered media container, ideal for previews and editor canvases.

```tsx
<CanvasStage hint="Tap to interact">
  <YourMedia />
</CanvasStage>
```

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `hint`  | `string` | —       |

### `OverlayIconButton`

A secondary icon-only button positioned over media (zoom, prev/next, etc.). Stops pointer & wheel propagation so it doesn't pan the underlying canvas.

```tsx
<CanvasStage>
  <OverlayIconButton placement="top-right" aria-label="Zoom">
    <ZoomInIcon />
  </OverlayIconButton>
  <OverlayIconButton placement="bottom-left"  aria-label="Previous">
    <ChevronLeftIcon />
  </OverlayIconButton>
  <OverlayIconButton placement="bottom-right" aria-label="Next">
    <ChevronRightIcon />
  </OverlayIconButton>
</CanvasStage>
```

| Prop        | Type                                              | Default |
| ----------- | ------------------------------------------------- | ------- |
| `placement` | `'top-right' \| 'bottom-left' \| 'bottom-right'`  | —       |
| (all other `Button` props except `variant` / `iconOnly`) | — | — |

### `ImageThumb`

Image thumbnail with placeholder + error fallback.

```tsx
<ImageThumb src={url} alt="Cover" size="md" fit="cover" />
<ImageThumb src={null} alt="Empty" placeholder={<MutedText>No image</MutedText>} />
```

| Prop           | Type                          | Default       |
| -------------- | ----------------------------- | ------------- |
| `src`          | `string \| null`              | —             |
| `alt`          | `string`                      | —             |
| `size`         | `'sm' \| 'md' \| 'fluid'`     | `'md'`        |
| `fit`          | `'contain' \| 'cover'`        | `'contain'`   |
| `placeholder`  | `ReactNode`                   | `'No image'`  |
| `onImageError` | `() => void`                  | —             |

---

## UI — Skeletons

<p align="center">
  <img src="https://raw.githubusercontent.com/MaxouJS/whiteboard/main/docs/images/panel-skeletons.png" width="820" alt="Skeleton primitives and widget skeletons" />
</p>

### `Skeleton` (base)

Animated placeholder. Use the primitives below for common shapes, or compose your own.

```tsx
<Skeleton style={{ width: 120, height: 16 }} />
<Skeleton radius="md" style={{ width: 80, height: 80 }} />
<Skeleton radius="pill" style={{ width: 64, height: 24 }} />
```

| Prop     | Type                       | Default |
| -------- | -------------------------- | ------- |
| `radius` | `'sm' \| 'md' \| 'pill'`   | `'sm'`  |
| `as`     | `ElementType`              | `'div'` |

### Primitive skeletons

Pre-sized shapes that line up with the corresponding component:

```tsx
import {
  TitleSkeleton,        // matches an asset / section title line
  LineSkeleton,         // <LineSkeleton short /> for a half-width line
  InputSkeleton,        // matches <Input>
  SelectSkeleton,       // matches <Select>
  TextareaSkeleton,     // matches <Textarea>
  ButtonSkeleton,       // matches <Button>
  IconButtonSkeleton,   // matches <Button iconOnly>
  ChipSkeleton,         // matches <Chip> / <Pill>
  ThumbSkeleton,        // matches <ImageThumb>
  AvatarSkeleton,       // matches <AvatarBadge>
  CanvasSkeleton,       // matches <CanvasStage>
} from '@objectifthunes/whiteboard'
```

All accept native `div` props (`className`, `style`, …).

### Widget skeletons

Higher-level placeholders that mirror common card layouts.

```tsx
import {
  PanelFormSkeleton,    // <PanelFormSkeleton inputs={3} showButton />
  StoryCardSkeleton,    // matches a hero story card
  UserCardSkeleton,     // matches a user row
  UserListSkeleton,     // <UserListSkeleton count={5} />
  AssetCardSkeleton,    // matches an asset card with thumb + chips + actions
  PickerGridSkeleton,   // <PickerGridSkeleton count={8} gridClass="picker-grid--elements" />
} from '@objectifthunes/whiteboard'
```

`PanelFormSkeleton`

| Prop         | Type      | Default |
| ------------ | --------- | ------- |
| `inputs`     | `number`  | `1`     |
| `showButton` | `boolean` | `true`  |

`UserListSkeleton`

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `count` | `number` | `3`     |

`PickerGridSkeleton`

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `count`     | `number` | `8`     |
| `gridClass` | `string` | —       |

### `ChoiceGroupSkeleton`

A skeleton form for `ChoiceGroup`.

```tsx
<ChoiceGroupSkeleton count={4} withDescription />
```

| Prop              | Type      | Default |
| ----------------- | --------- | ------- |
| `count`           | `number`  | `4`     |
| `withDescription` | `boolean` | `false` |

---

## UI — Panel sections

### `PanelSection`

A semantic `<section>` with optional heading, description, and a right-aligned actions slot.

```tsx
<PanelSection
  heading="Assets"
  description="Drag an asset onto the canvas."
  actions={<Button variant="secondary">Upload</Button>}
>
  <ItemList>…</ItemList>
</PanelSection>
```

| Prop          | Type        |
| ------------- | ----------- |
| `heading`     | `ReactNode` |
| `description` | `ReactNode` |
| `actions`     | `ReactNode` |

### `PanelTitle`

Title with a leading icon. Pass a **component type** (not an element):

```tsx
import { LayersIcon } from 'lucide-react'

<FloatingPanel title={<PanelTitle icon={LayersIcon} label="Layers" />} … />
```

| Prop    | Type                                                       |
| ------- | ---------------------------------------------------------- |
| `icon`  | `ComponentType<{ size?: number; className?: string }>`     |
| `label` | `string`                                                   |

---

## Theming

### `ThemeToggle`

Controlled toggle that renders a moon / sun icon. Wire it to your own theme state.

```tsx
const [theme, setTheme] = useState<'light' | 'dark'>('light')

useEffect(() => {
  document.documentElement.dataset.theme = theme
}, [theme])

<WhiteboardShell
  extraActions={
    <ThemeToggle
      theme={theme}
      onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
    />
  }
/>
```

| Prop        | Type                  | Default   |
| ----------- | --------------------- | --------- |
| `theme`     | `'light' \| 'dark'`   | `'light'` |
| `onToggle`  | `() => void`          | —         |
| `lightIcon` | `ReactNode`           | sun       |
| `darkIcon`  | `ReactNode`           | moon      |
| `className` | `string`              | —         |

### CSS & theming

The package ships a single stylesheet. Import it once at the root:

```tsx
import '@objectifthunes/whiteboard/style.css'
```

Theming uses CSS custom properties on `[data-theme]`. The built-in styles expose tokens for surfaces, borders, text, and accents — you can override any of them on `:root` or scoped to `[data-theme="dark"]`:

```css
:root {
  --wb-bg: #f3f4f6;
  --wb-surface: #ffffff;
  --wb-text: #111827;
  --wb-text-muted: #6b7280;
  --wb-border: #e5e7eb;
  --wb-primary: #1f2937;
  --wb-danger: #dc2626;
  /* …and more — inspect dist/whiteboard.css for the full set */
}

[data-theme='dark'] {
  --wb-bg: #0f1117;
  --wb-surface: #1a1d27;
  --wb-text: #e5e7eb;
  --wb-text-muted: #6b7280;
  --wb-border: #2d3041;
  --wb-primary: #e5e7eb;
}
```

`<ThemeToggle />` is intentionally **uncontrolled** of the DOM — you decide where the `data-theme` attribute lives (usually `<html>`).

---

## TypeScript

All exports ship with `.d.ts` declarations. Notable re-exported types:

```ts
import type { PanelRect, WhiteboardStore, ChoiceOption } from '@objectifthunes/whiteboard'
```

`PanelRect`:

```ts
type PanelRect = {
  x: number
  y: number
  width: number
  height: number
  focusPadding?: number
  focusMaxScale?: number
}
```

`ChoiceOption<T extends string>`:

```ts
type ChoiceOption<T extends string> = {
  value: T
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}
```

---

## Recipes

### Track a panel's rect, then place another below it

```tsx
const settingsRect = usePanelRect({ x: 40, y: 60 })

<FloatingPanel title="Settings" defaultPosition={{ x: 40, y: 60 }} trackRect={settingsRect}>
  …
</FloatingPanel>

<FloatingPanel title="Layers" defaultPosition={belowPanel(settingsRect.current)}>
  …
</FloatingPanel>
```

### Programmatic camera control

```tsx
const fitToContent = useWhiteboardStore(s => s.fitToContent)
const focusPanel   = useWhiteboardStore(s => s.focusPanel)

<Button onClick={fitToContent}>Fit all</Button>
<Button onClick={() => focusPanel({ x: 0, y: 0, width: 600, height: 400 }, { maxScale: 2 })}>
  Zoom hero
</Button>
```

### Loading → real content swap

```tsx
<FloatingPanel title="Assets" defaultPosition={pos}>
  {loading ? (
    <PanelFormSkeleton inputs={2} />
  ) : (
    <PanelSection heading="Assets">
      <ItemList>…</ItemList>
    </PanelSection>
  )}
</FloatingPanel>
```

### Custom shell without minimap

```tsx
<WhiteboardShell showMinimap={false}>
  <FloatingPanel title="Solo" defaultPosition={{ x: 80, y: 80 }}>…</FloatingPanel>
</WhiteboardShell>
```

---

## Browser support

Modern evergreen browsers. Uses `PointerEvent` and `ResizeObserver`; both are available everywhere except very old IE/Edge legacy.

---

## License

MIT © ObjectifThunes
