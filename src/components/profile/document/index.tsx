import type { NewsItem } from '@/api/news'
import { envConfig } from '@/utils/envConfig'
import { useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'

export const documentType = ['home.document.blog', 'home.document.resource', 'home.document.community', 'home.document.doc']
function Document({ data }: { data: NewsItem }) {
  const { i18n } = useTranslation()
  function getContentOfLang(type: 'title' | 'image' | 'desc') {
    const lang = i18n.language
    return data[(`${type}_${lang}`) as keyof NewsItem] as string
  }
  function getDateOfLang() {
    const lang = i18n.language
    const newsType = data.newsType
    switch (lang) {
      case 'zh':
        return newsType.title_zh
      case 'en':
        return newsType.title_en
      case 'jp':
        return newsType.title_jp
      default:
        return ''
    }
  }
  const navigate = useNavigate()
  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate({
        to: `/news/detail/${data.id}`
      })}
    >
      <img className="w-full" style={{ aspectRatio: '1920/1080' }} src={envConfig.apiUrl + getContentOfLang('image')} alt="" />
      <div className="py-22px max-lg:py-8px max-md:py-2px max-xl:py-14px">
        {/* 限制为两行 */}
        <div
          title={getContentOfLang('title')}
          className="line-clamp-2 text-26px font-bold leading-10 max-lg:mb-1 max-lg:text-15px max-xl:text-22px max-lg:leading-5 max-xl:leading-8"
        >
          {getContentOfLang('title')}
        </div>
        <div title={getContentOfLang('desc')} className="line-clamp-3 text-16px text-#A7A9AD leading-[24px] max-lg:text-12px max-xl:text-14px max-lg:leading-4 max-xl:leading-5">
          {getContentOfLang('desc')}
        </div>
      </div>
      <div className="fyc justify-between gap-20px leading-30px max-lg:gap-1 max-xl:gap-8 max-md:text-11px">
        <span key={getDateOfLang()}>{getDateOfLang()}</span>
        <span>{dayjs(data.create_time * 1000).format(`MM-DD，YYYY`)}</span>
      </div>
    </div>
  )
}

export default Document
