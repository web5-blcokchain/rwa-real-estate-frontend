import type { NewsItem } from '@/api/news'
import { getNewsDetail } from '@/api/news'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './index.scss'

export const Route = createLazyFileRoute('/_app/news/detail/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { i18n } = useTranslation()
  const { params } = useMatch({
    from: '/_app/news/detail/$id'
  })
  const navigation = useNavigate()
  useEffect(() => {
    if (!params.id) {
      navigation({ to: '/news' })
    }
  }, [])
  const { data: newsDetail, isFetching } = useQuery({
    queryKey: ['getNewsDetail', params.id],
    queryFn: async () => {
      const data = await getNewsDetail({ id: Number(params.id) })
      return data.data
    },
    enabled: !!params.id
  })
  function getContentOfLang(type: 'title' | 'image' | 'desc' | 'detail') {
    if (!newsDetail)
      return ''
    const lang = i18n.language
    return newsDetail[(`${type}_${lang}`) as keyof NewsItem] as string
  }
  return (
    <Waiting for={!isFetching} className={cn(isFetching && 'fccc h-300px')}>
      <div className="mt-16 px-121px max-lg:px-20px max-xl:px-60px">
        <div className="mb-3 text-5xl font-600 max-lg:mb-1 max-xl:mb-2 max-lg:text-3xl max-xl:text-4xl">{getContentOfLang('title')}</div>
        <div className="text-2xl max-lg:text-base max-xl:text-xl">{getContentOfLang('desc')}</div>
        {/* <img className="mt-65px w-full max-lg:mt-24px max-xl:mt-40px" src={featureCard} alt="" /> */}
        <div className="markdonw-content mt-41px text-6 text-xl max-lg:mt-16px max-xl:mt-28px space-y-4 max-lg:text-sm max-xl:text-base max-lg:space-y-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {getContentOfLang('detail')}
          </ReactMarkdown>
        </div>
      </div>
    </Waiting>
  )
}
