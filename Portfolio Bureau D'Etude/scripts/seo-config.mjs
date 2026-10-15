import { site } from '../src/data/site.js'

// A real domain is required; never publish example URLs as business information.
export function getPublicUrl() {
  const value = process.env.SITE_URL || site.siteUrl
  if (!value) return null
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('SITE_URL doit être une origine HTTPS sans chemin, identifiants ou paramètres.')
  }
  return url.origin
}

export function getPublicSiteUrl(base = '/') {
  const origin = getPublicUrl()
  return origin ? new URL(base, `${origin}/`).href : null
}

export function seoPlugin() {
  let base = '/'
  return {
    name: 'bureau-seo',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml(html) {
      const publicSiteUrl = getPublicSiteUrl(base)
      const data = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: site.name,
        email: site.email || undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Rue des Chouhada',
          addressLocality: site.city,
          addressRegion: 'Tizi Ouzou',
          addressCountry: 'DZ',
        },
        ...(publicSiteUrl ? { url: publicSiteUrl } : {}),
        ...(site.phone && !site.phoneProvisional ? { telephone: site.phone } : {}),
      }
      const tags = [
        { tag: 'meta', attrs: { name: 'robots', content: publicSiteUrl ? 'index, follow' : 'noindex, nofollow' }, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(data).replaceAll('<', '\\u003c'), injectTo: 'head' },
      ]
      if (publicSiteUrl) {
        tags.push({ tag: 'link', attrs: { rel: 'canonical', href: publicSiteUrl }, injectTo: 'head' })
        tags.push({ tag: 'meta', attrs: { property: 'og:url', content: publicSiteUrl }, injectTo: 'head' })
        const imageUrl = new URL('media/residence-1280.webp', publicSiteUrl).href
        html = html.replace(`content="${base}media/residence-1280.webp"`, `content="${imageUrl}"`)
      }
      return { html, tags }
    },
  }
}
