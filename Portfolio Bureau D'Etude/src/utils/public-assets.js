// Public files are copied as-is; Vite cannot rewrite URLs stored in JS data.
export function publicAssetUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

export function publicAssetSrcSet(srcSet) {
  return srcSet.split(',').map((candidate) => {
    const [path, ...descriptor] = candidate.trim().split(/\s+/)
    return [publicAssetUrl(path), ...descriptor].join(' ')
  }).join(', ')
}
