interface Props {
  title: string
  content: string
}

const Card: FC<Props> = ({ title, content, children }) => {
  return (
    <div className="rounded-xl bg-background-secondary px-8 py-6 lt-md:flex lt-md:items-center lt-md:gap-6 space-y-3">
      <div className="size-18 fcc shrink-0 rounded-full bg-primary">
        {children}
      </div>
      <div className="space-y-3">
        <div>{title}</div>
        <div>{content}</div>
      </div>
    </div>
  )
}

export default Card
