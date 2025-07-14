import copyToClipboard from 'copy-to-clipboard'

export function copy(text: string, t: any) {
  const success = copyToClipboard(text)

  if (success) {
    toast.success(t('common.copy_success'))
  }
  else {
    toast.error(t('common.copy_failed'))
  }
}
