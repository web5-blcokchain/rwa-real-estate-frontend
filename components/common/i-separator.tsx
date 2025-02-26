import { cn } from "@/utils/style"
import { DetailedHTMLProps, HTMLAttributes } from "react"

interface Props {
  text?: string
}

const ISeparator: FC<
  Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({
  text,
  className,
  ...props
}) => {
    if (!text) {
      return (
        <div {...props} className={cn(
          className,
          'w-full h-0.25 bg-border'
        )}>
        </div>
      )
    }

    return (
      <div {...props} className={cn(
        className,
        'w-full fbc gap-2'
      )}>
        <div className="w-full h-1px bg-border"></div>
        <div className="text-4 text-[#b5b5b5]">{text}</div>
        <div className="w-full h-1px bg-border"></div>
      </div>
    )
  }

export default ISeparator
