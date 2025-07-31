import { IImage } from '@/components/common/i-image'
import { UploadFileType } from '@/enums/file'

interface ImagePreviewProps {
  /**
   * 图片地址或图片地址数组
   */
  src: string | string[]
  /**
   * 每个图片容器的类名
   */
  imageContainerClass?: string
  /**
   * 每个图片的类名
   */
  imageClass?: string
  /**
   * 容器类名
   */
  className?: string
  /**
   * 图片点击事件
   */
  onImageClick?: (src: string, index: number) => void
  /**
   * 标签文本数组，与图片一一对应
   */
  labels?: string[]
  /**
   * 文件类型
   */
  fileType?: UploadFileType
  /**
   * 文件名数组，与文件一一对应（仅当 fileType 为 Document 时有效）
   */
  fileNames?: string[]
}

/**
 * 文件预览组件 - 展示单个或多个图片/文档
 */
export const FilePreview: FC<
  ImagePreviewProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  src,
  imageContainerClass,
  imageClass,
  className,
  onImageClick,
  labels,
  fileType = UploadFileType.Image,
  fileNames,
  ...props
}) => {
  // 将单个字符串转换为数组处理
  const files = Array.isArray(src) ? src : [src]

  // 获取文件名
  const getFileName = (url: string, index: number) => {
    if (fileNames && fileNames[index]) {
      return fileNames[index]
    }
    // 从URL提取文件名
    try {
      const urlObj = new URL(url)
      const pathSegments = urlObj.pathname.split('/')
      return pathSegments[pathSegments.length - 1]
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (e) {
      // 如果不是有效URL，尝试从路径中提取
      const pathSegments = url.split('/')
      return pathSegments[pathSegments.length - 1]
    }
  }

  return (
    <div
      className={cn(
        'flex',
        files.length > 1 ? 'flex-row gap-4' : 'flex-col',
        className
      )}
      {...props}
    >
      {files.map((file, index) => (
        <div
          key={`${file}-${index}`}
          className="h-full flex-1 space-y-2"
        >
          {labels && labels[index] && (
            <div className="text-center text-3.5 text-[#b5b5b5]">{labels[index]}</div>
          )}

          {
            fileType === UploadFileType.Image
              ? (
                  <div
                    className={cn(
                      'w-full of-hidden',
                      'b-white b-1 b-solid hover:b-primary-1 transition-colors duration-200',
                      'clickable-99 min-h-50px',
                      imageContainerClass
                    )}
                    onClick={() => onImageClick?.(file, index)}
                  >
                    <IImage
                      src={file}
                      imgClass={cn('w-full min-h-50px aspect-[3/2] object-cover', imageClass)}
                    />
                  </div>
                )
              : (
                  <div
                    className={cn(
                      'w-full py-3 px-4',
                      'b-white b-1 b-solid hover:b-primary-1 transition-colors duration-200',
                      'clickable-99 flex items-center gap-2',
                      imageContainerClass
                    )}
                    onClick={() => onImageClick?.(file, index)}
                  >
                    <div className="i-material-symbols-description text-5 text-white"></div>
                    <div className="truncate text-white">{getFileName(file, index)}</div>
                  </div>
                )
          }
        </div>
      ))}
    </div>
  )
}
