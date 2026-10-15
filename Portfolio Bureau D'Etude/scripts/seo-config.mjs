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

export function seoPlugin() {
  return {
    name: 'bureau-seo',
    transformIndexHtml(html) {
      const origin = getPublicUrl()
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
        ...(origin ? { url: origin } : {}),
        ...(site.phone && !site.phoneProvisional ? { telephone: site.phone } : {}),
      }
      const tags = [
        { tag: 'meta', attrs: { name: 'robots', content: origin ? 'index, follow' : 'noindex, nofollow' }, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(data).replaceAll('<', '\\u003c'), injectTo: 'head' },
      ]
      if (origin) {
        tags.push({ tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` }, injectTo: 'head' })
        tags.push({ tag: 'meta', attrs: { property: 'og:url', content: `${origin}/` }, injectTo: 'head' })
        html = html.replace('content="/media/residence-1280.webp"', `content="${origin}/media/residence-1280.webp"`)
      }
      return { html, tags }
    },
  }
}
