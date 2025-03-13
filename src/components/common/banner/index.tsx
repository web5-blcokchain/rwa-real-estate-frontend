import styles from './style.module.scss'

export const Banner: FC<{
  picture: string
  title: string
  subTitle: string
}> = ({
  picture,
  title,
  subTitle,
  children
}) => {
  return (
    <div>
      <div
        style={{
          '--banner-background': `url(${picture})`
        } as Record<string, any>}
        className={cn(
          styles.banner,
          'h-100 flex flex-col justify-center gap-6 px-10'
        )}
      >
        <div className="text-white lt-md:text-8 md:text-11">{title}</div>
        <div className="max-w-2xl text-white lt-md:text-4 md:text-5">{subTitle}</div>
        {children}
      </div>
    </div>
  )
}
