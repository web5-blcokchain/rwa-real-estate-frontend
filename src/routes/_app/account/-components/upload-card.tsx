import { FilePreview } from '@/components/common/file-preview'
import { UploadFileType } from '@/enums/file'
import { cn } from '@/utils/style'
import { Spin, Upload } from 'antd'

export function UploadIcon({ icon, iconClass, title, subTitle, beforeUpload, style }: { icon: string, iconClass: string, title: string, subTitle: string, beforeUpload?: (e: File) => void | undefined, style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        'fccc select-none gap-4 b b-white rounded b-dashed py-6',
        beforeUpload ? 'clickable-99' : ''
      )}
      style={style}
    >
      <div>
        <img
          src={icon}
          className={cn(
            'size-10',
            iconClass
          )}
        />
      </div>
      <div className="text-center text-white">{title}</div>
      <div className="text-center text-3 text-[#b5b5b5]">{subTitle}</div>
    </div>
  )
}

const UploadCard: FC<{
  label?: string
  title: string | string[]
  subTitle: string | string[]
  icon: string | string[]
  iconClass?: string | string[]
  beforeUpload?: (e: File, index?: number) => void | undefined
  other?: React.ReactNode
  src?: string | string[] // 添加图片地址属性,
  loading?: boolean
  number?: number
  className?: string
  width?: string
}> = ({
  label,
  title,
  subTitle,
  icon,
  iconClass = '',
  children,
  beforeUpload,
  src,
  other,
  loading = false,
  number = 1,
  className = '',
  width
}) => {
  const fileType = useMemo(() => {
    // 判断url是图片还是文件
    const isImage = (url: string) => {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
      return imageExtensions.some(ext => url.toLowerCase().endsWith(ext))
    }
    if (Array.isArray(src)) {
      return src.map(item => isImage(item) ? UploadFileType.Image : UploadFileType.Document)
    }
    return isImage(src || '') ? UploadFileType.Image : UploadFileType.Document
  }, [src])
  return (

    <div className={cn('rounded-xl bg-background-secondary p-6 space-y-4')}>
      <div className="text-4 text-white">{label}</div>
      {other}
      <Spin spinning={loading}>
        <div className={cn(className)}>
          {' '}
          {
            Array.from({ length: number }).map((_, index) => (
              <Upload
                style={{ width }}
                key={index}
                className={cn('UploadCard space-y-4', number > 1 && 'fyc')}
                showUploadList={false}
                beforeUpload={(e: File) => {
                  beforeUpload?.(e, index)
                  return false
                }}
                disabled={!beforeUpload}
              >
                {
                  src && src.length > 0
                    ? (
                        number === 1
                          ? (
                              <div className="space-y-4">
                                <FilePreview
                                  src={src}
                                  imageContainerClass="rounded-lg of-hidden"
                                  fileType={Array.isArray(fileType) ? fileType[0] : fileType}
                                />
                              </div>
                            )
                          : (
                              src[index]
                                ? (
                                    <div className="space-y-4">
                                      <FilePreview
                                        src={[src[index]]}
                                        imageContainerClass="rounded-lg of-hidden"
                                        fileType={Array.isArray(fileType) ? fileType[index] : fileType}
                                      />
                                    </div>
                                  )
                                : <UploadIcon icon={(Array.isArray(icon) ? icon[index] : icon)} iconClass={Array.isArray(iconClass) ? iconClass[index] : iconClass} title={Array.isArray(title) ? title[index] : title} subTitle={Array.isArray(subTitle) ? subTitle[index] : subTitle} beforeUpload={beforeUpload} />
                            )
                      )
                    : <UploadIcon icon={(Array.isArray(icon) ? icon[0] : icon)} iconClass={Array.isArray(iconClass) ? iconClass[0] : iconClass} title={Array.isArray(title) ? title[0] : title} subTitle={Array.isArray(subTitle) ? subTitle[0] : subTitle} beforeUpload={beforeUpload} />
                }

              </Upload>
            ))
          }
        </div>
        {/* <Upload
          className="UploadCard space-y-4"
          showUploadList={false}
          beforeUpload={(e: File) => {
            beforeUpload?.(e)
            return false
          }}
          disabled={!beforeUpload}
        >
          {
            src && src.length > 0
              ? (
                  <div className="space-y-4">
                    <FilePreview
                      src={src}
                      imageContainerClass="rounded-lg of-hidden"
                    />
                  </div>
                )
              : (
                  <div className={cn(
                    'fccc select-none gap-4 b b-white rounded b-dashed py-6',
                    beforeUpload ? 'clickable-99' : ''
                  )}
                  >
                    <div>
                      <img
                        src={icon}
                        className={cn(
                          'size-10',
                          iconClass
                        )}
                      />
                    </div>
                    <div className="text-white">{title}</div>
                    <div className="text-3 text-[#b5b5b5]">{subTitle}</div>
                  </div>
                )
          }

        </Upload> */}
      </Spin>
      {children}
    </div>

  )
}

export default UploadCard
