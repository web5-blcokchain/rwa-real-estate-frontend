interface Props {
  title: string
  content: string
}

const Card: FC<Props> = ({ title, content, children }) => {
  return (
    <div className="rounded-xl bg-background-secondary px-8 py-6 space-y-3">
      <div className="size-26 fcc rounded-full bg-primary">
        {children}
      </div>
      <div>{title}</div>
      <div>{content}</div>
    </div>
  )
}

export default Card
