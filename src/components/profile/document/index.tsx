import dayjs from 'dayjs'

export const documentType = ['home.document.blog', 'home.document.resource', 'home.document.community', 'home.document.doc']
function Document({ data, index }: { data: any, index: number }) {
  const { t } = useTranslation()
  return (
    <div className="cursor-pointer">
      <img className="w-full" src={data.img} alt="" />
      <div className="py-22px max-lg:py-8px max-md:py-2px max-xl:py-14px">
        {/* 限制为两行 */}
        <div
          title={data.title}
          className="line-clamp-2 text-26px font-bold leading-10 max-lg:mb-1 max-lg:text-15px max-xl:text-22px max-lg:leading-5 max-xl:leading-8"
        >
          {t(data.title)}
        </div>
        <div title={data.content} className="line-clamp-3 text-16px text-#A7A9AD leading-[24px] max-lg:text-12px max-xl:text-14px max-lg:leading-4 max-xl:leading-5">
          {t(data.content)}
        </div>
      </div>
      <div className="fyc gap-20px max-lg:gap-4 max-xl:gap-8 max-md:text-12px max-md:leading-30px">
        <span key={documentType[index]}>{t(documentType[index])}</span>
        <span>{dayjs(data.date).format(`M${t('common.month')}D，YYYY`)}</span>
      </div>
    </div>
  )
}

export default Document
