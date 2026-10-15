import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const root = fileURLToPath(new URL('../', import.meta.url))
const resultsDir = path.join(root, 'test-results')
const baseURL = 'http://127.0.0.1:4174'
const email = 'kamal.moulouel@gmail.com'
const motionOnly = process.argv.includes('--motion-only')
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small', width: 320, height: 740 },
]
const report = {
  ok: false,
  baseURL,
  mode: motionOnly ? 'motion-only' : 'full',
  reducedMotion: 'reduce',
  motion: {
    reduced: { preference: 'reduce', checkedViewports: [], skipped: motionOnly, ok: null },
    normal: { preference: 'no-preference', checkedHeadings: [], ok: false },
  },
  viewports: [],
  accessibility: [],
  pageErrors: [],
  screenshots: [],
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
let server
let browser
let serverError
let serverOutput = ''

async function waitForServer() {
  const deadline = Date.now() + 10_000
  while (Date.now() < deadline) {
    if (serverError) throw serverError
    if (server.exitCode !== null) {
      throw new Error(`Vite preview s’est arrêté (${server.exitCode}). ${serverOutput}`)
    }
    try {
      const response = await fetch(baseURL, { signal: AbortSignal.timeout(500) })
      if (response.ok) return
    } catch {
      // Le serveur peut encore être en cours de démarrage.
    }
    await delay(100)
  }
  throw new Error(`Vite preview ne répond pas après 10 secondes. ${serverOutput}`)
}

async function revealAndCheckImages(page) {
  await page.evaluate(async () => {
    const step = Math.max(300, window.innerHeight - 120)
    for (let position = 0; position < document.documentElement.scrollHeight; position += step) {
      window.scrollTo({ top: position, behavior: 'instant' })
      await new Promise((resolve) => setTimeout(resolve, 35))
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
  })

  await page.waitForFunction(
    () => Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
    undefined,
    { timeout: 10_000 },
  )
  const images = await page.locator('img').count()
  assert.ok(images > 0, 'Aucune image trouvée sur la page.')
  return images
}

async function checkAccessibility(page, viewport, scope, selector) {
  let audit = new AxeBuilder({ page })
  if (selector) audit = audit.include(selector)
  const results = await audit.analyze()
  const violations = results.violations
    .filter((violation) => ['serious', 'critical'].includes(violation.impact))
    .map(({ id, impact, help, helpUrl, nodes }) => ({
      id,
      impact,
      help,
      helpUrl,
      targets: nodes.map((node) => node.target),
    }))
  report.accessibility.push({ viewport, scope, violations })
  assert.equal(
    violations.length,
    0,
    `Accessibilité ${viewport}/${scope} : ${JSON.stringify(violations)}`,
  )
}

function assertNoPageErrors() {
  assert.equal(report.pageErrors.length, 0, `Erreurs JavaScript : ${JSON.stringify(report.pageErrors)}`)
}

async function checkBasePage(page, viewport) {
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('form')).toHaveCount(0)
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0)

  const mailLinks = await page.locator('a[href^="mailto:"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')),
  )
  assert.ok(mailLinks.length > 0, 'Le lien de contact par courriel est absent.')
  for (const href of mailLinks) {
    assert.equal(decodeURIComponent(href.slice('mailto:'.length).split('?')[0]), email)
  }

  const imageCount = await revealAndCheckImages(page)
  const dimensions = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    viewport: window.innerWidth,
  }))
  assert.ok(
    dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport,
    `Débordement horizontal ${viewport.name} : ${JSON.stringify(dimensions)}`,
  )
  assertNoPageErrors()
  return { name: viewport.name, width: viewport.width, height: viewport.height, imageCount }
}

async function checkGallery(page) {
  const gallery = page.locator('#projets')
  const filters = page.getByRole('group').filter({
    has: page.getByRole('button', { name: 'Ensembles résidentiels', exact: true }),
  }).first()
  await expect(filters).toBeVisible()

  for (const [label, expected] of [
    ['Ensembles résidentiels', 2],
    ['Plans & modèles', 3],
    ['Tous les visuels', 4],
  ]) {
    await filters.getByRole('button', { name: label, exact: true }).click()
    await expect(gallery.getByRole('button', { name: /^Agrandir/ })).toHaveCount(expected)
  }

  const trigger = gallery.getByRole('button', { name: /^Agrandir/ }).first()
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
}

async function checkLegalDialogs(page, viewport) {
  const footer = page.locator('footer')
  for (const label of ['Mentions légales', 'Confidentialité']) {
    const trigger = footer.getByRole('button', { name: label, exact: true })
      .or(footer.getByRole('link', { name: label, exact: true })).first()
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    assert.equal(await dialog.evaluate((element) => element.tagName), 'DIALOG')
    assert.equal(await dialog.evaluate((element) => element.matches(':modal')), true)
    await checkAccessibility(page, viewport, label, 'dialog[open]')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(trigger).toBeFocused()
  }
}

async function checkMobileMenu(page) {
  const trigger = page.getByRole('button', { name: 'Ouvrir le menu', exact: true })
  const navigation = page.getByRole('navigation', { name: 'Navigation mobile', exact: true })
  await trigger.click()
  await expect(navigation).toBeVisible()
  await checkAccessibility(page, 'mobile', 'menu ouvert')
  await navigation.getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(navigation).toBeHidden()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport({ ratio: 0.1 })

  await trigger.click()
  await expect(navigation).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(navigation).toBeHidden()
  await expect(trigger).toBeFocused()
}

async function resetAndCapture(page, name) {
  const allFilter = page.getByRole('group').filter({
    has: page.getByRole('button', { name: 'Ensembles résidentiels', exact: true }),
  }).first().getByRole('button', { name: 'Tous les visuels', exact: true })
  await allFilter.click()
  await expect(page.locator('#projets').getByRole('button', { name: /^Agrandir/ })).toHaveCount(4)
  await page.evaluate(() => {
    history.replaceState(null, '', `${location.pathname}${location.search}`)
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })
  await page.screenshot({ path: path.join(resultsDir, `${name}.png`), fullPage: true })
  report.screenshots.push(`test-results/${name}.png`)
  await page.screenshot({ path: path.join(resultsDir, `${name}-viewport.png`), fullPage: false })
  report.screenshots.push(`test-results/${name}-viewport.png`)
}

async function checkNormalMotion() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'no-preference',
    locale: 'fr-FR',
  })
  try {
    const page = await context.newPage()
    page.on('pageerror', (error) => {
      report.pageErrors.push({ viewport: 'desktop-motion-normal', message: error.message })
    })
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30_000 })
    assert.equal(
      await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
      false,
      'Le contexte normal doit autoriser les animations.',
    )

    async function expectVisibleAncestors(heading) {
      const label = (await heading.textContent()).trim()
      await expect(heading).toBeVisible({ timeout: 2000 })
      await expect.poll(async () => heading.evaluate((element) => {
        let minimumOpacity = 1
        for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor)
          if (style.display === 'none' || style.visibility === 'hidden') return 0
          minimumOpacity = Math.min(minimumOpacity, Number(style.opacity))
        }
        return minimumOpacity
      }), {
        timeout: 2000,
        message: `Le titre « ${label} » et ses parents doivent finir leur apparition en 2 secondes.`,
      }).toBeGreaterThan(0.99)
      report.motion.normal.checkedHeadings.push(label)
    }

    await expectVisibleAncestors(page.locator('h1').first())
    const sectionHeadings = page.locator('main section h2')
    const sectionCount = await sectionHeadings.count()
    assert.ok(sectionCount > 0, 'Aucun titre de section trouvé pour vérifier les animations.')
    for (let index = 0; index < sectionCount; index += 1) {
      const heading = sectionHeadings.nth(index)
      await heading.evaluate((element) => {
        element.scrollIntoView({ block: 'center', behavior: 'instant' })
      })
      await expectVisibleAncestors(heading)
    }
    assertNoPageErrors()
    report.motion.normal.ok = true
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: path.join(resultsDir, 'desktop-viewport.png'), fullPage: false })
    report.screenshots.push('test-results/desktop-viewport.png')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({ path: path.join(resultsDir, 'mobile-viewport.png'), fullPage: false })
    report.screenshots.push('test-results/mobile-viewport.png')
  } finally {
    await context.close()
  }
}

async function stopServer() {
  if (!server || server.exitCode !== null || serverError) return
  const exited = new Promise((resolve) => server.once('exit', resolve))
  server.kill('SIGTERM')
  await Promise.race([exited, delay(2000)])
  if (server.exitCode === null) server.kill('SIGKILL')
}

try {
  await mkdir(resultsDir, { recursive: true })
  server = spawn(process.execPath, [
    path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
    'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort',
  ], { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  server.on('error', (error) => { serverError = error })
  for (const stream of [server.stdout, server.stderr]) {
    stream.on('data', (chunk) => { serverOutput = `${serverOutput}${chunk}`.slice(-4000) })
  }
  await waitForServer()
  const installedBrowser = process.env.CHROME_PATH || (process.platform === 'win32' ? [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].find((candidate) => existsSync(candidate)) : undefined)
  browser = await chromium.launch({
    headless: true,
    ...(installedBrowser ? { executablePath: installedBrowser } : {}),
  })

  for (const viewport of motionOnly ? [] : viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce',
      locale: 'fr-FR',
    })
    try {
      const page = await context.newPage()
      page.setDefaultTimeout(10_000)
      page.on('pageerror', (error) => {
        report.pageErrors.push({ viewport: viewport.name, message: error.message })
      })
      await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30_000 })
      const summary = await checkBasePage(page, viewport)

      if (viewport.name === 'desktop') {
        await checkGallery(page)
        await checkAccessibility(page, viewport.name, 'page')
        await checkLegalDialogs(page, viewport.name)
        await resetAndCapture(page, viewport.name)
      }
      if (viewport.name === 'mobile') {
        await checkAccessibility(page, viewport.name, 'page')
        await checkMobileMenu(page)
        await checkLegalDialogs(page, viewport.name)
        await resetAndCapture(page, viewport.name)
      }

      assertNoPageErrors()
      report.viewports.push({ ...summary, ok: true })
    } finally {
      await context.close()
    }
  }
  report.motion.reduced.checkedViewports = report.viewports.map(({ name }) => name)
  report.motion.reduced.ok = motionOnly ? null : report.viewports.length === viewports.length
  await checkNormalMotion()
  assertNoPageErrors()
  report.ok = true
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error)
  process.exitCode = 1
} finally {
  if (browser) {
    try { await browser.close() } catch (error) {
      report.cleanupError = `Navigateur : ${error.message}`
      report.ok = false
      process.exitCode = 1
    }
  }
  await stopServer()
  await mkdir(resultsDir, { recursive: true })
  await writeFile(path.join(resultsDir, motionOnly ? 'motion-report.json' : 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
}
