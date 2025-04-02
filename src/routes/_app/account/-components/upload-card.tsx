import { cn } from '@/utils/style'
import { Upload } from 'antd'

const UploadCard: FC<{
  label: string
  title: string
  subTitle: string
  icon: string
  iconClass?: string
  beforeUpload?: (e: File) => void | undefined
}> = ({
  label,
  title,
  subTitle,
  icon,
  iconClass = '',
  children,
  beforeUpload
}) => {
  return (
    <div className="rounded-xl bg-background-secondary p-6 space-y-4">
      <div className="text-4 text-white">{label}</div>
      <Upload
        className="UploadCard space-y-4"
        showUploadList={false}
        beforeUpload={(e: File) => {
          beforeUpload?.(e)
          return false
        }}
      >
        <div className="fccc select-none gap-4 b b-white rounded b-dashed py-6 clickable-99">
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
      </Upload>
      {children}
    </div>
  )
}

export default UploadCard
