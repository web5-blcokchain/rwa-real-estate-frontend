import { IImage } from '@/components/common/i-image'

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
}

/**
 * 图片预览组件 - 展示单个或多个图片
 */
export const ImagePreview: FC<
  ImagePreviewProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  src,
  imageContainerClass,
  imageClass,
  className,
  onImageClick,
  labels,
  ...props
}) => {
  // 将单个字符串转换为数组处理
  const images = Array.isArray(src) ? src : [src]

  return (
    <div
      className={cn(
        'flex',
        images.length > 1 ? 'flex-row gap-4' : 'flex-col',
        className
      )}
      {...props}
    >
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className="flex-1 space-y-2"
        >
          {labels && labels[index] && (
            <div className="text-center text-3.5 text-[#b5b5b5]">{labels[index]}</div>
          )}
          <div
            className={cn(
              'w-full of-hidden',
              'b-white b-1 b-solid hover:b-primary-1 transition-colors duration-200',
              'clickable-99',
              imageContainerClass
            )}
            onClick={() => onImageClick?.(image, index)}
          >
            <IImage
              src={image}
              imgClass={cn('w-full aspect-[3/2] object-cover', imageClass)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
