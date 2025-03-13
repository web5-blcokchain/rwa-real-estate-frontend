import copyToClipboard from 'copy-to-clipboard'

export function copy(text: string) {
  const success = copyToClipboard(text)

  if (success) {
    toast.success('Copied to clipboard')
  }
  else {
    toast.error('Failed to copy to clipboard')
  }
}
