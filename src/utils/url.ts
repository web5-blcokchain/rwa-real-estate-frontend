export function useImagePath(path: string) {
  return `${import.meta.env.VITE_PUBLIC_API_URL}${path}`
}
