export const Help: FC = () => {
  const list = [
    {
      icon: 'i-mdi-information',
      text: 'Platform Introduction',
      link: ''
    },
    {
      icon: 'i-material-symbols-book-2-rounded',
      text: 'Beginner\'s Guide',
      link: ''
    },
    {
      icon: 'i-ic-sharp-sync-alt',
      text: 'Secondary Market Help',
      link: ''
    },
    {
      icon: 'i-basil-refresh-solid',
      text: 'Platform Redemption',
      link: ''
    },
    {
      icon: 'i-mingcute-service-fill',
      text: 'Technical Support',
      link: ''
    }
  ]

  return (
    <ul className="px-4 space-y-6">
      {
        list.map((item, index) => (
          <li
            key={index}
            className="fyc gap-2"
          >
            <div className={cn(
              item.icon,
              'bg-primary-2 size-5'
            )}
            >
            </div>

            <div className="text-4 text-white">{item.text}</div>
          </li>
        ))
      }
    </ul>
  )
}
