import type { DetailedHTMLProps, InputHTMLAttributes, SyntheticEvent } from 'react'

export const IImage: FC<
  {
    src: string
    imgClass?: string
    onLoad?: (e: SyntheticEvent<HTMLImageElement, Event>) => void
  } & DetailedHTMLProps<InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({
  src,
  imgClass,
  onLoad,
  className,
  ...props
}) => {
  const [loading, setLoading] = useState(true)

  const handleLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false)
    onLoad?.(e)
  }

  const handleError = () => {
    setLoading(false)
  }

  return (
    <div
      className={cn(
        'pr of-hidden',
        className
      )}
      {...props}
    >
      {
        loading && (
          <div className="pa inset-0 fcc bg-background-secondary">
            <div className="i-eos-icons-loading"></div>
          </div>
        )
      }
      <img
        src={src}
        className={cn(
          'size-full',
          imgClass
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
