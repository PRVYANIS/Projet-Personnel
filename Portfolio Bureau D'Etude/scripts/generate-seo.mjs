import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolveConfig } from 'vite'
import { getPublicSiteUrl } from './seo-config.mjs'

const { base } = await resolveConfig({}, 'build')
const directory = new URL('../public/site/', import.meta.url)
await mkdir(directory, { recursive: true })
const publicSiteUrl = getPublicSiteUrl(base)
if (publicSiteUrl) {
  const sitemapUrl = new URL('sitemap.xml', publicSiteUrl).href
  await writeFile(new URL('robots.txt', directory), `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`)
  const escapedPublicUrl = publicSiteUrl.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&apos;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  await writeFile(new URL('sitemap.xml', directory), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapedPublicUrl}</loc></url></urlset>\n`)
  console.log(`SEO prêt pour ${publicSiteUrl} : sitemap, robots, canonical et Open Graph.`)
} else {
  await writeFile(new URL('robots.txt', directory), 'User-agent: *\nDisallow: /\n')
  console.log('Version locale : indexation désactivée. Définir SITE_URL avant publication pour générer le sitemap et les URL publiques.')
}
console.log(`Fichiers SEO : ${fileURLToPath(directory)}`)
