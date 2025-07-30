import { envConfig } from './envConfig'

export function joinImagePath(path: string) {
  if (!path) {
    return ''
  }

  return `${envConfig.apiUrl}${path}`
}

export function joinImagesPath(paths?: string) {
  return paths?.split(',').map(joinImagePath) || []
}
