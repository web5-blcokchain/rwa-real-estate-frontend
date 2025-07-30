import { FilePreview } from '@/components/common/file-preview'
import { UploadFileType } from '@/enums/file'
import { UploadIcon } from '@/routes/_app/account/-components/upload-card'
import { Upload } from 'antd'

function urlTofileType(fileUrl: string) {
  // 判断url是图片还是文件
  const isImage = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext))
  }
  return isImage(fileUrl || '') ? UploadFileType.Image : UploadFileType.Document
}

function UploadMultifileCard({
  fileType,
  fileUrl,
  width = '200px',
  height = '120px',
  icon = '',
  title = '',
  label = '',
  beforeUpload,
  iconClass = '',
  maxLength = 1,
  className = '',
  removeFile
}: {
  fileType: string
  fileUrl: string[]
  width?: string
  height?: string
  icon?: string
  title?: string
  label?: string
  beforeUpload?: (e: File, index?: number) => void | undefined
  iconClass?: string
  maxLength?: number
  className?: string
  removeFile?: (index: number) => void
}) {
  const toFileUrl = (file: string) => {
    window.open(file, '_blank')
  }

  return (
    <div>
      <Upload
        className={cn('UploadCard space-y-4')}
        showUploadList={false}
        beforeUpload={(e: File) => {
          if (fileUrl.length < maxLength)
            beforeUpload?.(e)
          return false
        }}
        disabled={!beforeUpload}
        accept={fileType}
      >
        <div className={cn('flex gap-3 max-lg:flex-col', className)}>
          {fileUrl.map((item, index) => {
            return (
              <div
                key={`${item}-${index}`}
                className="relative fcc [&>div]:h-full [&>.remove-child]:hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <FilePreview
                  style={{ width, height }}
                  src={item}
                  imageContainerClass="rounded-lg of-hidden h-full"
                  fileType={urlTofileType(item)}
                  imageClass="h-full  aspect-[none] "
                  onImageClick={(_file, _index) => {
                    if (urlTofileType(item) === UploadFileType.Image) {
                      // e.stopPropagation()
                    }
                    else {
                      toFileUrl(item)
                    }
                  }}
                />
                <div className="remove-child absolute left-0 top-0 h-full w-full fcc bg-black/50 opacity-0 transition-opacity duration-200">
                  <div onClick={() => removeFile?.(index)} className="cursor-pointer">
                    <div className="i-material-symbols:delete-outline bg-#575757; size-6"></div>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="h-full">
            {fileUrl.length < maxLength && <UploadIcon style={{ width, height }} icon={icon} iconClass={iconClass} title={title} subTitle={label} beforeUpload={beforeUpload} />}
          </div>
        </div>
      </Upload>
    </div>
  )
}

export default UploadMultifileCard
