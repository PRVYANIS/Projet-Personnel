import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { getPublicUrl } from './seo-config.mjs'

const directory = new URL('../public/site/', import.meta.url)
await mkdir(directory, { recursive: true })
const origin = getPublicUrl()
if (origin) {
  await writeFile(new URL('robots.txt', directory), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)
  const escapedOrigin = origin.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&apos;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  await writeFile(new URL('sitemap.xml', directory), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapedOrigin}/</loc></url></urlset>\n`)
  console.log(`SEO prêt pour ${origin} : sitemap, robots, canonical et Open Graph.`)
} else {
  await writeFile(new URL('robots.txt', directory), 'User-agent: *\nDisallow: /\n')
  console.log('Version locale : indexation désactivée. Définir SITE_URL avant publication pour générer le sitemap et les URL publiques.')
}
console.log(`Fichiers SEO : ${fileURLToPath(directory)}`)
