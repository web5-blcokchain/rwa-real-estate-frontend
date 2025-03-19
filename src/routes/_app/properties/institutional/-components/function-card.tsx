import { Button } from 'antd'

export const FunctionCard: FC<{
  icon: string
  title: string
  description: string
  buttonText: string
  buttonClick: () => void
}> = ({
  icon,
  title,
  description,
  buttonText,
  buttonClick
}) => {
  return (
    <div className="rounded-xl bg-[#1e2024] p-8 space-y-4">
      <div className="size-12 fcc rounded-full bg-primary-2">
        <SvgIcon name={icon} className="size-4" />
      </div>

      <div className="text-5 font-medium">{title}</div>

      <div className="text-3.5 text-[#b5b5b5]">{description}</div>

      <div className="fcc pt-4">
        <Button
          type="primary"
          className="text-black!"
          onClick={buttonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
