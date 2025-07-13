import { FilePreview } from '@/components/common/file-preview'
import { cn } from '@/utils/style'
import { Spin, Upload } from 'antd'

const UploadCard: FC<{
  label: string
  title: string
  subTitle: string
  icon: string
  iconClass?: string
  beforeUpload?: (e: File) => void | undefined
  other?: React.ReactNode
  src?: string | string[] // 添加图片地址属性,
  loading?: boolean
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
  loading = false
}) => {
  return (

    <div className="rounded-xl bg-background-secondary p-6 space-y-4">
      <div className="text-4 text-white">{label}</div>
      {other}
      <Spin spinning={loading}>
        <Upload
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

        </Upload>
      </Spin>
      {children}
    </div>

  )
}

export default UploadCard
