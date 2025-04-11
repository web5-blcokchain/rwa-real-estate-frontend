export function joinImagePath(path: string) {
  if (!path) {
    return ''
  }

  return `${import.meta.env.VITE_PUBLIC_API_URL}${path}`
}

export function joinImagesPath(paths?: string) {
  return paths?.split(',').map(joinImagePath) || []
}
