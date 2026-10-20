/**
 * Resolve local video paths with proper base URL support for GitHub Pages / subpaths.
 */
export function getLocalVideoUrl(pathOrId?: string): string {
  if (!pathOrId) return ''
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  
  // Strip leading slash and existing 'videos/' prefix
  let clean = pathOrId.replace(/^\//, '')
  if (clean.startsWith('videos/')) {
    clean = clean.replace(/^videos\//, '')
  }
  
  const filename = clean.endsWith('.mp4') ? clean : `${clean}.mp4`
  return `${base}videos/${filename}`
}
