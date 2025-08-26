import { FilePreview } from '@/components/common/file-preview'
import { UploadFileType } from '@/enums/file'
import { UploadIcon } from '@/routes/_app/account/-components/upload-card'
import { Image, Spin, Upload } from 'antd'

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
  removeFile,
  loading = false
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
  loading?: boolean
}) {
  const toFileUrl = (file: string) => {
    window.open(file, '_blank')
  }
  const [imageList, setImageList] = useState<string[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewCurrent, setPreviewCurrent] = useState(0)
  return (
    <div>
      <Upload
        className={cn('UploadCard space-y-4 w-fit block')}
        showUploadList={false}
        beforeUpload={(e: File) => {
          if (fileUrl.length < maxLength) {
            // setNowUploadLoading([...nowUploadLoading,e.name])
            beforeUpload?.(e)
          }

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
                className="relative fcc [&>div]:h-full max-md:w-full [&>.remove-child]:hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <FilePreview
                  style={{ width, height }}
                  src={item}
                  className="max-md:!w-full"
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

                <div className="remove-child absolute left-0 top-0 h-full w-full fcc gap-3 bg-black/50 opacity-0 transition-opacity duration-200">
                  <div
                    onClick={() => {
                      if (urlTofileType(item) === UploadFileType.Image) {
                        setImageList([item])
                        setPreviewVisible(true)
                      }
                      else {
                        toFileUrl(item)
                      }
                    }}
                    className="cursor-pointer clickable"
                  >
                    <div className="i-weui:eyes-on-outlined size-6"></div>
                  </div>
                  <div onClick={() => removeFile?.(index)} className="cursor-pointer clickable">
                    <div className="bg-#575757; i-material-symbols:delete-outline size-6"></div>
                  </div>
                </div>
              </div>
            )
          })}
          <Image.PreviewGroup
            items={imageList}
            preview={{
              visible: previewVisible,
              current: previewCurrent,
              onVisibleChange: vis => setPreviewVisible(vis),
              onChange: current => setPreviewCurrent(current)
            }}
          >
            {/* <img className="max-h-128 w-full" src={imageList[0]} alt="" /> */}
          </Image.PreviewGroup>
          <div className="h-full">
            {fileUrl.length < maxLength
              && (
                <Spin spinning={loading}>
                  <UploadIcon className="max-md:!w-full" style={{ width, height }} icon={icon} iconClass={iconClass} title={title} subTitle={label} beforeUpload={beforeUpload} />
                </Spin>
              )}
          </div>
        </div>
      </Upload>
    </div>
  )
}

export default UploadMultifileCard
