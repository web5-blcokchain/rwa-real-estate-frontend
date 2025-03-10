interface SvgIconProps {
  name: string
  [x: string]: any
}

export const SvgIcon: FC<SvgIconProps> = ({
  name,
  ...props
}: SvgIconProps) => {
  const symbolId = `#icon-${name}`

  return (
    <svg {...props} aria-hidden="true">
      <use href={symbolId} />
    </svg>
  )
}
