import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../docs/images')
const URL = process.env.DEMO_URL ?? 'http://localhost:5173/'

const VIEWPORT = { width: 1440, height: 900 }
const DEVICE_SCALE = 2

// Per-panel slugs: title shown in the demo → file slug used in the README.
const PANELS = [
  { title: 'Getting Started',     slug: 'panel-getting-started' },
  { title: 'Button',              slug: 'panel-button' },
  { title: 'Forms',               slug: 'panel-forms' },
  { title: 'Status & Feedback',   slug: 'panel-status' },
  { title: 'Layout',              slug: 'panel-layout' },
  { title: 'Typography',          slug: 'panel-typography' },
  { title: 'Cards & Lists',       slug: 'panel-cards' },
  { title: 'Overlays & Dialogs',  slug: 'panel-overlays' },
  { title: 'Navigation & Canvas', slug: 'panel-navigation' },
  { title: 'Skeletons',           slug: 'panel-skeletons' },
]

function waitFrames(page, n) {
  return page.evaluate(
    (count) =>
      new Promise((resolve) => {
        let i = 0
        ;(function tick() {
          if (++i >= count) return resolve()
          requestAnimationFrame(tick)
        })()
      }),
    n,
  )
}

const fitToContent = (page) =>
  page.evaluate(() => window.__wb.getState().fitToContent())

const focusRect = (page, rect, maxScale = 1.2) =>
  page.evaluate(
    ({ r, ms }) => window.__wb.getState().focusPanel(r, { maxScale: ms }),
    { r: rect, ms: maxScale },
  )

const setTheme = (page, theme) =>
  page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme)

// Read every panel's world-space rect (left/top/width/offsetHeight) by title.
async function readPanelRects(page) {
  return page.evaluate(() => {
    const rects = {}
    for (const el of document.querySelectorAll('.floating-panel')) {
      const title = el.querySelector('.floating-panel__title')?.textContent?.trim() ?? ''
      const left = parseFloat(el.style.left || '0')
      const top = parseFloat(el.style.top || '0')
      const width = parseFloat(el.style.width || `${el.offsetWidth}`)
      const height = el.offsetHeight
      rects[title] = { x: left, y: top, width, height }
    }
    return rects
  })
}

async function newPage(context) {
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => !!window.__wb && document.querySelectorAll('.floating-panel').length >= 10, null, { timeout: 15000 })
  await waitFrames(page, 60)
  return page
}

async function shootOverview(context, { name, theme, focus }) {
  const page = await newPage(context)
  if (theme === 'dark') {
    await setTheme(page, 'dark')
    await waitFrames(page, 10)
  }
  if (focus) {
    await focusRect(page, focus.rect, focus.maxScale ?? 1.1)
  } else {
    await fitToContent(page)
  }
  await waitFrames(page, 20)
  console.log(`  → ${name}.png`)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  await page.close()
}

// After focusing on a panel, get its on-screen bounding box (CSS pixels).
async function readFocusedPanelClientRect(page, title) {
  return page.evaluate((t) => {
    for (const el of document.querySelectorAll('.floating-panel')) {
      const text = el.querySelector('.floating-panel__title')?.textContent?.trim() ?? ''
      if (text === t) {
        const r = el.getBoundingClientRect()
        return { x: r.x, y: r.y, width: r.width, height: r.height }
      }
    }
    return null
  }, title)
}

async function shootPanels(context, theme) {
  const page = await newPage(context)
  if (theme === 'dark') {
    await setTheme(page, 'dark')
    await waitFrames(page, 10)
  }
  await fitToContent(page)
  await waitFrames(page, 20)
  const rects = await readPanelRects(page)

  for (const { title, slug } of PANELS) {
    const r = rects[title]
    if (!r) {
      console.warn(`  ! Panel "${title}" not found — skipped`)
      continue
    }
    await focusRect(page, r, 2.5)
    await waitFrames(page, 25)

    const onScreen = await readFocusedPanelClientRect(page, title)
    const name = theme === 'dark' ? `${slug}-dark.png` : `${slug}.png`
    console.log(`  → ${name}`)

    if (onScreen) {
      // Pad and clamp to viewport.
      const PAD = 24
      const clip = {
        x: Math.max(0, Math.floor(onScreen.x - PAD)),
        y: Math.max(0, Math.floor(onScreen.y - PAD)),
        width: Math.min(VIEWPORT.width, Math.ceil(onScreen.width + PAD * 2)),
        height: Math.min(VIEWPORT.height, Math.ceil(onScreen.height + PAD * 2)),
      }
      clip.width = Math.min(clip.width, VIEWPORT.width - clip.x)
      clip.height = Math.min(clip.height, VIEWPORT.height - clip.y)
      await page.screenshot({ path: `${OUT}/${name}`, clip })
    } else {
      await page.screenshot({ path: `${OUT}/${name}` })
    }
  }

  await page.close()
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
  })

  console.log('• Overview shots')
  await shootOverview(context, { name: 'overview', theme: 'light' })
  await shootOverview(context, { name: 'dark', theme: 'dark' })
  await shootOverview(context, {
    name: 'detail',
    theme: 'light',
    focus: { rect: { x: 40, y: 40, width: 1200, height: 600 }, maxScale: 1.1 },
  })

  console.log('• Per-panel shots (light)')
  await shootPanels(context, 'light')

  console.log('• Per-panel shots (dark)')
  await shootPanels(context, 'dark')

  await browser.close()
  console.log('Done!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
