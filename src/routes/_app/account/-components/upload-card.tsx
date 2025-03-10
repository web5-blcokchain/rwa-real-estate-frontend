import { cn } from '@/utils/style'

const UploadCard: FC<{
  label: string
  title: string
  subTitle: string
  icon: string
  iconClass?: string
}> = ({
  label,
  title,
  subTitle,
  icon,
  iconClass = '',
  children
}) => {
  return (
    <div className="rounded-xl bg-background-secondary p-6 space-y-4">
      <div className="text-4">{label}</div>

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
        <div>{title}</div>
        <div className="text-3 text-[#b5b5b5]">{subTitle}</div>
      </div>

      {children}
    </div>
  )
}

export default UploadCard
