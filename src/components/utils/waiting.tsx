export const Waiting: FC<{
  for?: boolean
  iconClass?: string
} & React.ButtonHTMLAttributes<HTMLDivElement>> = ({ children, for: waitingFor, iconClass, ...props }) => {
  return (
    <>
      {
        waitingFor
          ? children
          : (
              <div {...props}>
                <div className={cn(
                  'i-eos-icons-loading',
                  iconClass || '!size-5'
                )}
                />
              </div>
            )
      }
    </>
  )
}
